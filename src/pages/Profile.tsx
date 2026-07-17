import { User, Building, MapPin, FileText, ShoppingCart, Upload, Gift, ChevronRight, Settings, HelpCircle, LayoutDashboard, Users, Award, TrendingUp, Coins, Image } from 'lucide-react';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import { USER_ROLES, POINT_RULES } from '@/constants';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const user = useStore((state) => state.user);
  const projects = useStore((state) => state.projects);
  const orders = useStore((state) => state.orders);
  const getMyCases = useStore((state) => state.getMyCases);
  const getPointRecords = useStore((state) => state.getPointRecords);

  const isAdmin = user?.role === 'admin';
  const isProvincial = user?.role === 'provincial';

  const roleLabel = USER_ROLES.find((r) => r.value === user?.role)?.label || '用户';
  const myProjects = projects.filter(p => user && p.dealerName === user.name);
  const myOrders = orders.filter(o => user && o.dealerId === user.id);
  const myCases = getMyCases();
  const pointRecords = getPointRecords();

  const totalArea = myProjects.reduce((sum, p) => sum + p.area, 0);
  const totalOrderAmount = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const levelInfo = isProvincial
    ? { level: '省级总代', nextLevel: '—', progress: 100 }
    : { level: '城市经销商', nextLevel: '省级总代', progress: 45 };

  const adminMenuItems = [
    { icon: LayoutDashboard, label: '管理后台', page: 'admin-dashboard' },
    { icon: Users, label: '经销商管理', page: 'dealer-management' },
    { icon: FileText, label: '项目审核', page: 'project-review' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management' },
    { icon: Image, label: '案例审核', page: 'case-review' },
  ];

  const dealerMenuItems = [
    { icon: FileText, label: '项目报备', page: 'project-report' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management' },
    { icon: Upload, label: '上传案例', page: 'case-upload' },
    { icon: Image, label: '我的案例', page: 'my-cases' },
  ];

  const provincialExtraItems = [
    { icon: Users, label: '下级经销商', page: 'sub-dealers' },
  ];

  const menuItems = isAdmin
    ? adminMenuItems
    : isProvincial
    ? [...dealerMenuItems, ...provincialExtraItems]
    : dealerMenuItems;

  const toolItems = [
    { icon: Gift, label: '积分兑换', page: 'point-mall' },
    { icon: FileText, label: '资料下载', page: 'download' },
    { icon: HelpCircle, label: '帮助中心', page: 'help' },
    { icon: Settings, label: '账户设置', page: 'settings' },
  ];

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-12 pb-8 px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/70 text-sm">
            <Building size={16} />
            <span>{user?.company}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
            <MapPin size={16} />
            <span>
              {user?.province}
              {user?.city && ` · ${user.city}`}
            </span>
          </div>
        </div>

        <div className="px-4 -mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">管理功能</h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className="w-full flex items-center justify-between py-3 border-b border-yaozhiyan-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-indigo-500" />
                      <span className="text-sm text-yaozhiyan-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-yaozhiyan-gray-400" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="px-4 mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">其他</h3>
            <div className="space-y-1">
              {toolItems.slice(-3).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between py-3 border-b border-yaozhiyan-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-yaozhiyan-gray-500" />
                      <span className="text-sm text-yaozhiyan-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-yaozhiyan-gray-400" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-yaozhiyan-gray-400">曜之岩（广州）建材科技有限公司</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <div className="bg-gradient-to-br from-yaozhiyan-primary via-yaozhiyan-primaryLight to-yaozhiyan-secondary pt-12 pb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded">
                {roleLabel}
              </span>
              <span className="text-white/70 text-sm">{user?.company}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-yellow-300" />
              <span className="text-white text-sm font-medium">我的积分</span>
            </div>
            <button
              onClick={() => onNavigate('points')}
              className="text-white/70 text-xs flex items-center gap-1"
            >
              积分明细
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-bold text-white">{user?.points?.toLocaleString() || 0}</span>
            <span className="text-white/70 text-sm">积分</span>
          </div>
          <div className="flex items-center gap-4 text-white/70 text-xs">
            <span>累计获得 {(user?.totalPoints || 0).toLocaleString()} 积分</span>
            <span className="flex items-center gap-1">
              <Gift size={12} />
              上传案例奖励 +{POINT_RULES.upload_case_approved} 积分
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xl font-bold text-yaozhiyan-primary">{myProjects.length}</p>
              <p className="text-xs text-yaozhiyan-gray-500 mt-0.5">报备项目</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-500">{myOrders.length}</p>
              <p className="text-xs text-yaozhiyan-gray-500 mt-0.5">订单数</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-500">{totalArea.toLocaleString()}</p>
              <p className="text-xs text-yaozhiyan-gray-500 mt-0.5">㎡ 项目面积</p>
            </div>
            <div>
              <p className="text-xl font-bold text-purple-500">{myCases.length}</p>
              <p className="text-xs text-yaozhiyan-gray-500 mt-0.5">上传案例</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-yaozhiyan-primary" />
              <span className="text-sm font-medium text-yaozhiyan-gray-700">经销商等级</span>
            </div>
            <span className="text-xs text-yaozhiyan-primary">{levelInfo.level}</span>
          </div>
          <div className="w-full h-2 bg-yaozhiyan-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-yaozhiyan-primary to-yaozhiyan-secondary rounded-full"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yaozhiyan-gray-400">当前等级</span>
            <span className="text-yaozhiyan-gray-400">下一级：{levelInfo.nextLevel}</span>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">我的业务</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {dealerMenuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.page)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-11 h-11 rounded-xl bg-yaozhiyan-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-yaozhiyan-primary" />
                  </div>
                  <span className="text-xs text-yaozhiyan-gray-600 text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.page)}
                  className="w-full flex items-center justify-between py-2.5 border-b border-yaozhiyan-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-yaozhiyan-gray-500" />
                    <span className="text-sm text-yaozhiyan-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-yaozhiyan-gray-400" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">工具与服务</h3>
          <div className="space-y-1">
            {toolItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.page && onNavigate(item.page)}
                  className="w-full flex items-center justify-between py-2.5 border-b border-yaozhiyan-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-yaozhiyan-gray-500" />
                    <span className="text-sm text-yaozhiyan-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-yaozhiyan-gray-400" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-yaozhiyan-gray-400">曜之岩（广州）建材科技有限公司</p>
      </div>
    </div>
  );
}
