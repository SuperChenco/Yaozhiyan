import { TrendingUp, Users, FileText, ShoppingCart, DollarSign, Building2, Download, Package, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { exportDealers, exportProjects, exportOrders } from '@/utils';
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
  const pointRecords = useStore((state) => state.pointRecords);
  const { isAdmin } = useAuth();

  const handleExportDealers = () => {
    const ok = exportDealers(dealerList, pointRecords, { filename: '经销商报表' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };
  const handleExportProjects = () => {
    const ok = exportProjects(projects, { filename: '项目台账' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };
  const handleExportOrders = () => {
    const ok = exportOrders(orders, { filename: '订单报表' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };

  const pendingDealers = dealerList.filter((d) => d.status === 'pending').length;
  const pendingProjects = projects.filter((p) => p.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalArea = projects.reduce((sum, p) => sum + p.area, 0);

  const quickActions = [
    { icon: Users, label: '经销商管理', page: 'dealer-management', badge: pendingDealers, color: 'text-rock-blue bg-rock-blue/10' },
    { icon: FileText, label: '项目审核', page: 'project-review', badge: pendingProjects, color: 'text-status-warn bg-status-warn/15' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'text-status-success bg-status-success/15' },
    { icon: DollarSign, label: '价格管理', page: 'price-management', color: 'text-rock-hover bg-rock-hover/15' },
    { icon: Package, label: '产品管理', page: 'product-manage', color: 'text-rock-blue bg-rock-blue/10' },
    { icon: ShoppingBag, label: '样品销售', page: 'sample-sales', color: 'text-status-success bg-status-success/15' },
  ];

  const provincialDealers = dealerList.filter((d) => d.level === 'provincial').length;
  const cityDealers = dealerList.filter((d) => d.level === 'city').length;

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="管理后台" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="bg-steel-dark text-steel-white rounded-base p-5 mb-4">
          <p className="text-sm opacity-80 mb-1">欢迎回来</p>
          <h2 className="text-xl font-bold mb-4">管理员工作台</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-steel-white/10 rounded-base p-3">
              <p className="text-sm opacity-80">经销商总数</p>
              <p className="text-2xl text-steel-white font-bold mt-1">{dealerList.length}</p>
            </div>
            <div className="bg-steel-white/10 rounded-base p-3">
              <p className="text-sm opacity-80">待审核</p>
              <p className="text-2xl text-steel-white font-bold mt-1">{pendingDealers}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-base bg-status-success/15 flex items-center justify-center">
                <DollarSign size={18} className="text-status-success" />
              </div>
              <span className="text-xs text-steel-light-gray">总营收</span>
            </div>
            <p className="text-lg font-bold text-carbon-black">¥{(totalRevenue / 10000).toFixed(1)}万</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-base bg-rock-blue/10 flex items-center justify-center">
                <Building2 size={18} className="text-rock-blue" />
              </div>
              <span className="text-xs text-steel-light-gray">项目面积</span>
            </div>
            <p className="text-lg font-bold text-carbon-black">{totalArea.toLocaleString()}㎡</p>
          </Card>
        </div>

        <h3 className="text-sm font-medium text-steel-gray mb-3">快捷操作</h3>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="default"
                onClick={() => onNavigate(item.page)}
                className="!p-0 !bg-transparent !border-0 !shadow-none hover:!border-0 relative"
              >
                <Card className="p-3 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-base ${item.color.split(' ')[1]} flex items-center justify-center`}>
                    <Icon size={20} className={item.color.split(' ')[0]} />
                  </div>
                  <span className="text-xs text-steel-gray text-center">{item.label}</span>
                </Card>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-status-danger text-steel-white text-xs rounded-base flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {isAdmin && (
          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3">数据导出</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="default" onClick={handleExportDealers}>
                <Download size={14} className="mr-1" />
                经销商
              </Button>
              <Button variant="default" onClick={handleExportProjects}>
                <Download size={14} className="mr-1" />
                项目台账
              </Button>
              <Button variant="default" onClick={handleExportOrders}>
                <Download size={14} className="mr-1" />
                订单报表
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4 mb-4">
          <h3 className="text-sm font-medium text-steel-gray mb-3">经销商分布</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-base bg-rock-blue" />
                <span className="text-sm text-steel-gray">省级总代</span>
              </div>
              <span className="text-sm font-medium text-carbon-black">{provincialDealers} 家</span>
            </div>
            <div className="w-full h-2 bg-steel-light rounded-base overflow-hidden">
              <div
                className="h-full bg-rock-blue rounded-base"
                style={{ width: `${dealerList.length > 0 ? (provincialDealers / dealerList.length) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-base bg-rock-hover" />
                <span className="text-sm text-steel-gray">城市经销商</span>
              </div>
              <span className="text-sm font-medium text-carbon-black">{cityDealers} 家</span>
            </div>
            <div className="w-full h-2 bg-steel-light rounded-base overflow-hidden">
              <div
                className="h-full bg-rock-hover rounded-base"
                style={{ width: `${dealerList.length > 0 ? (cityDealers / dealerList.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-steel-gray">最新询价</h3>
            <Button
              variant="default"
              onClick={() => onNavigate('inquiry-list')}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-rock-blue hover:!text-rock-blue hover:!border-0"
            >
              查看全部
            </Button>
          </div>
          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="flex items-start justify-between pb-3 border-b border-steel-light-gray last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm text-steel-gray">{inquiry.name}</p>
                  <p className="text-xs text-steel-light-gray mt-0.5">{inquiry.company}</p>
                </div>
                <span className="text-xs text-steel-light-gray">{inquiry.createdAt}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
