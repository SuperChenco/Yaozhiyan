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
import { useStore } from '@/store/useStore';

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
  'download',
  'help',
  'settings',
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogin, setIsLogin] = useState(true);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLogin(true);
    }
  }, [isLoggedIn]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
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
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showTabBar = !detailPages.includes(currentPage);

  if (isLogin) {
    if (isLoggedIn && user) {
      return (
        <div className="min-h-screen bg-yaozhiyan-gray-50">
          {renderPage()}
          {showTabBar && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-yaozhiyan-gray-100 px-2 py-2 z-50">
              <div className="flex justify-around">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentPage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleNavigate(tab.id)}
                      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                        isActive ? 'text-yaozhiyan-primary' : 'text-yaozhiyan-gray-400'
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
      <div className="min-h-screen bg-yaozhiyan-gray-50">
        <Login onRegister={() => setIsLogin(false)} onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50">
      <Register onBack={() => setIsLogin(true)} />
    </div>
  );
}
