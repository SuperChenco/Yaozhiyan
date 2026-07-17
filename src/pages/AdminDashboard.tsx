import { TrendingUp, Users, FileText, ShoppingCart, DollarSign, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import { DEALER_LEVELS } from '@/constants';

interface AdminDashboardProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onBack, onNavigate }: AdminDashboardProps) {
  const dealerList = useStore((state) => state.dealerList);
  const projects = useStore((state) => state.projects);
  const orders = useStore((state) => state.orders);
  const inquiries = useStore((state) => state.inquiries);

  const pendingDealers = dealerList.filter((d) => d.status === 'pending').length;
  const pendingProjects = projects.filter((p) => p.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalArea = projects.reduce((sum, p) => sum + p.area, 0);

  const quickActions = [
    { icon: Users, label: '经销商管理', page: 'dealer-management', badge: pendingDealers, color: 'text-blue-500 bg-blue-50' },
    { icon: FileText, label: '项目审核', page: 'project-review', badge: pendingProjects, color: 'text-amber-500 bg-amber-50' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'text-green-500 bg-green-50' },
    { icon: DollarSign, label: '价格管理', page: 'price-management', color: 'text-purple-500 bg-purple-50' },
  ];

  const provincialDealers = dealerList.filter((d) => d.level === 'provincial').length;
  const cityDealers = dealerList.filter((d) => d.level === 'city').length;

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="管理后台" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-yaozhiyan-primary via-yaozhiyan-primaryLight to-yaozhiyan-secondary rounded-xl p-5 text-white mb-4">
          <p className="text-sm opacity-80 mb-1">欢迎回来</p>
          <h2 className="text-xl font-bold mb-4">管理员工作台</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm opacity-80">经销商总数</p>
              <p className="text-2xl font-bold mt-1">{dealerList.length}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm opacity-80">待审核</p>
              <p className="text-2xl font-bold mt-1">{pendingDealers}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign size={18} className="text-green-500" />
              </div>
              <span className="text-xs text-yaozhiyan-gray-500">总营收</span>
            </div>
            <p className="text-lg font-bold text-yaozhiyan-gray-800">¥{(totalRevenue / 10000).toFixed(1)}万</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 size={18} className="text-blue-500" />
              </div>
              <span className="text-xs text-yaozhiyan-gray-500">项目面积</span>
            </div>
            <p className="text-lg font-bold text-yaozhiyan-gray-800">{totalArea.toLocaleString()}㎡</p>
          </Card>
        </div>

        <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">快捷操作</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className="relative"
              >
                <Card className="p-3 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg ${item.color.split(' ')[1]} flex items-center justify-center`}>
                    <Icon size={20} className={item.color.split(' ')[0]} />
                  </div>
                  <span className="text-xs text-yaozhiyan-gray-700 text-center">{item.label}</span>
                </Card>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Card className="p-4 mb-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">经销商分布</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yaozhiyan-primary" />
                <span className="text-sm text-yaozhiyan-gray-600">省级总代</span>
              </div>
              <span className="text-sm font-medium text-yaozhiyan-gray-800">{provincialDealers} 家</span>
            </div>
            <div className="w-full h-2 bg-yaozhiyan-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yaozhiyan-primary rounded-full"
                style={{ width: `${dealerList.length > 0 ? (provincialDealers / dealerList.length) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yaozhiyan-secondary" />
                <span className="text-sm text-yaozhiyan-gray-600">城市经销商</span>
              </div>
              <span className="text-sm font-medium text-yaozhiyan-gray-800">{cityDealers} 家</span>
            </div>
            <div className="w-full h-2 bg-yaozhiyan-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yaozhiyan-secondary rounded-full"
                style={{ width: `${dealerList.length > 0 ? (cityDealers / dealerList.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700">最新询价</h3>
            <button onClick={() => onNavigate('inquiry-list')} className="text-xs text-yaozhiyan-primary">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="flex items-start justify-between pb-3 border-b border-yaozhiyan-gray-100 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm text-yaozhiyan-gray-700">{inquiry.name}</p>
                  <p className="text-xs text-yaozhiyan-gray-400 mt-0.5">{inquiry.company}</p>
                </div>
                <span className="text-xs text-yaozhiyan-gray-400">{inquiry.createdAt}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}