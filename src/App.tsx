import { useState, useEffect } from 'react';
import { Home, FolderOpen, MessageSquare, User } from 'lucide-react';
import HomePage from '@/pages/Home';
import Product from '@/pages/Product';
import Cases from '@/pages/Cases';
import Inquiry from '@/pages/Inquiry';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ProjectReport from '@/pages/ProjectReport';
import OrderManagement from '@/pages/OrderManagement';
import PriceInquiry from '@/pages/PriceInquiry';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import DealerManagement from '@/pages/DealerManagement';
import PriceManagement from '@/pages/PriceManagement';
import CaseUpload from '@/pages/CaseUpload';
import MyCases from '@/pages/MyCases';
import CaseReview from '@/pages/CaseReview';
import Points from '@/pages/Points';
import PointsMall from '@/pages/PointsMall';
import ProductManage from '@/pages/ProductManage';
import SampleSales from '@/pages/SampleSales';
import NotFound from '@/pages/error/404';
import MessageNotify from '@/components/layout/MessageNotify';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { parseWechatCodeFromUrl, clearWechatCodeFromUrl } from '@/hooks/useWechatLogin';
import { isUseMock } from '@/api';
import type { UserRole } from '@/types';

const tabs = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'product', label: '产品', icon: FolderOpen },
  { id: 'cases', label: '案例', icon: MessageSquare },
  { id: 'profile', label: '我的', icon: User },
];

const detailPages = [
  'inquiry',
  'project-report',
  'order-management',
  'price-inquiry',
  'admin-dashboard',
  'dealer-management',
  'project-review',
  'price-management',
  'inquiry-list',
  'sub-dealers',
  'case-upload',
  'my-cases',
  'case-review',
  'points',
  'point-mall',
  'product-manage',
  'sample-sales',
  'download',
  'help',
  'settings',
];

// 页面级权限映射：仅管理员可访问的页面
const pagePermissionMap: Record<string, UserRole[]> = {
  'admin-dashboard': ['admin'],
  'dealer-management': ['admin'],
  'price-management': ['admin'],
  'case-review': ['admin'],
  'product-manage': ['admin'],
  'sample-sales': ['admin'],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogin, setIsLogin] = useState(true);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const user = useStore((state) => state.user);
  const initialize = useStore((state) => state.initialize);
  const globalLoading = useStore((state) => state.globalLoading);
  const globalError = useStore((state) => state.globalError);
  const clearError = useStore((state) => state.clearError);
  const notifyOpen = useStore((state) => state.notifyOpen);
  const toggleNotify = useStore((state) => state.toggleNotify);
  const { requirePageAuth } = useAuth();

  // 应用启动时初始化：检查 token、恢复用户、拉取后端数据
  useEffect(() => {
    if (isUseMock()) return; // Mock 模式下数据已在模块初始化时加载
    initialize();
  }, [initialize]);

  // 微信 OAuth2 回调闭环：URL 上有 code 时自动完成登录
  useEffect(() => {
    const parsed = parseWechatCodeFromUrl();
    if (!parsed) return;
    clearWechatCodeFromUrl();
    // 交给 store.wechatLogin 完成 token 持久化与数据拉取
    useStore.getState().wechatLogin(parsed.code).catch(() => {
      useStore.setState({ globalError: '微信授权失败，请重试' });
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLogin(true);
    }
  }, [isLoggedIn]);

  // globalError 自动消失（3s）
  useEffect(() => {
    if (!globalError) return;
    const timer = setTimeout(() => clearError(), 3000);
    return () => clearTimeout(timer);
  }, [globalError, clearError]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    // 页面级权限守卫：未登录跳登录页，已登录无权限跳 404
    const allowedRoles = pagePermissionMap[currentPage];
    if (allowedRoles) {
      const guard = requirePageAuth(allowedRoles);
      if (guard === '404') {
        return <NotFound onBack={() => setCurrentPage('home')} />;
      }
      // guard === 'login' 时由外层 isLogin 分支处理（实际不会到达这里）
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'product':
        return <Product onNavigate={handleNavigate} />;
      case 'cases':
        return <Cases />;
      case 'inquiry':
        return <Inquiry onBack={handleBack} />;
      case 'project-report':
        return <ProjectReport onBack={handleBack} />;
      case 'order-management':
        return <OrderManagement onBack={handleBack} />;
      case 'price-inquiry':
        return <PriceInquiry onBack={handleBack} onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard onBack={handleBack} onNavigate={handleNavigate} />;
      case 'dealer-management':
        return <DealerManagement onBack={handleBack} />;
      case 'price-management':
        return <PriceManagement onBack={handleBack} />;
      case 'case-upload':
        return <CaseUpload onBack={handleBack} />;
      case 'my-cases':
        return <MyCases onBack={handleBack} onNavigate={handleNavigate} />;
      case 'case-review':
        return <CaseReview onBack={handleBack} />;
      case 'points':
        return <Points onBack={handleBack} onNavigate={handleNavigate} />;
      case 'point-mall':
        return <PointsMall onBack={handleBack} />;
      case 'product-manage':
        return <ProductManage onBack={handleBack} />;
      case 'sample-sales':
        return <SampleSales onBack={handleBack} />;
      default:
        return <NotFound onBack={() => setCurrentPage('home')} />;
    }
  };

  const showTabBar = !detailPages.includes(currentPage);

  // 全局错误 toast（仅用现有 Tailwind 类，与 PriceManager 保存提示同款样式）
  const GlobalErrorToast = globalError ? (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-steel-dark text-steel-white px-6 py-3 rounded-base shadow-sm z-[100] text-sm max-w-[80%] text-center">
      {globalError}
    </div>
  ) : null;

  // 全局加载浮层（refreshAll 时显示）
  const GlobalLoading = globalLoading ? (
    <div className="fixed inset-0 bg-steel-dark/30 z-[99] flex items-center justify-center">
      <div className="bg-steel-white px-6 py-4 rounded-base shadow-sm flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-rock-blue border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-steel-gray">加载中…</span>
      </div>
    </div>
  ) : null;

  if (isLogin) {
    if (isLoggedIn && user) {
      return (
        <div className="min-h-screen bg-steel-light">
          {GlobalErrorToast}
          {GlobalLoading}
          {renderPage()}
          <MessageNotify
            open={notifyOpen}
            onClose={() => toggleNotify(false)}
            onJump={(page) => {
              toggleNotify(false);
              setCurrentPage(page);
            }}
          />
          {showTabBar && (
            <div className="fixed bottom-0 left-0 right-0 bg-steel-white border-t border-steel-light-gray px-2 py-2 z-50">
              <div className="flex justify-around">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentPage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleNavigate(tab.id)}
                      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-base transition-colors ${
                        isActive ? 'text-rock-blue' : 'text-steel-light-gray'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-steel-light">
        {GlobalErrorToast}
        <Login onRegister={() => setIsLogin(false)} onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light">
      {GlobalErrorToast}
      <Register onBack={() => setIsLogin(true)} />
    </div>
  );
}
