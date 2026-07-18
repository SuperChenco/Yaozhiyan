import { User, Building, MapPin, FileText, ShoppingCart, Upload, Gift, ChevronRight, Settings, HelpCircle, LayoutDashboard, Users, Award, Coins, Image } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { RoleBadge } from '@/components/StatusBadge';
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
  const userRole = (user?.role || 'city') as 'admin' | 'provincial' | 'city';
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

  // 透明背景菜单项按钮覆盖样式
  const menuItemBtnClass =
    '!w-full !flex !items-center !justify-between !py-2.5 !px-0 !bg-transparent !border-0 !shadow-none !rounded-none hover:!border-0';
  const menuItemBtnClassAdmin =
    '!w-full !flex !items-center !justify-between !py-3 !px-0 !bg-transparent !border-0 !shadow-none !rounded-none hover:!border-0';

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-steel-light pb-20">
        <div className="bg-steel-dark text-steel-white pt-12 pb-8 px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-steel-white/20 rounded-base flex items-center justify-center">
              <User size={32} className="text-steel-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-steel-white">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge label={roleLabel} role={userRole} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-steel-white/70 text-sm">
            <Building size={16} />
            <span>{user?.company}</span>
          </div>
          <div className="flex items-center gap-2 text-steel-white/70 text-sm mt-1">
            <MapPin size={16} />
            <span>
              {user?.province}
              {user?.city && ` · ${user.city}`}
            </span>
          </div>
        </div>

        <div className="px-4 -mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3">管理功能</h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="border-b border-steel-light-gray last:border-b-0">
                    <Button
                      variant="default"
                      onClick={() => onNavigate(item.page)}
                      className={menuItemBtnClassAdmin}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-rock-blue" />
                        <span className="text-sm text-steel-gray">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-steel-light-gray" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="px-4 mt-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3">其他</h3>
            <div className="space-y-1">
              {toolItems.slice(-3).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="border-b border-steel-light-gray last:border-b-0">
                    <Button variant="default" className={menuItemBtnClass}>
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-steel-light-gray" />
                        <span className="text-sm text-steel-gray">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-steel-light-gray" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-steel-light-gray">曜之岩（广州）建材科技有限公司</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <div className="bg-steel-dark text-steel-white pt-12 pb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-steel-white/20 rounded-base flex items-center justify-center">
            <User size={32} className="text-steel-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-steel-white">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <RoleBadge label={roleLabel} role={userRole} />
              <span className="text-steel-white/70 text-sm">{user?.company}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-steel-white/10 backdrop-blur-sm rounded-base p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-status-warn" />
              <span className="text-steel-white text-sm font-medium">我的积分</span>
            </div>
            <Button
              variant="default"
              onClick={() => onNavigate('points')}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-white/70 hover:!text-steel-white/70 hover:!border-0"
            >
              积分明细
              <ChevronRight size={12} />
            </Button>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-bold text-steel-white">{user?.points?.toLocaleString() || 0}</span>
            <span className="text-steel-white/70 text-sm">积分</span>
          </div>
          <div className="flex items-center gap-4 text-steel-white/70 text-xs">
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
              <p className="text-xl font-bold text-rock-blue">{myProjects.length}</p>
              <p className="text-xs text-steel-light-gray mt-0.5">报备项目</p>
            </div>
            <div>
              <p className="text-xl font-bold text-status-success">{myOrders.length}</p>
              <p className="text-xs text-steel-light-gray mt-0.5">订单数</p>
            </div>
            <div>
              <p className="text-xl font-bold text-status-warn">{totalArea.toLocaleString()}</p>
              <p className="text-xs text-steel-light-gray mt-0.5">㎡ 项目面积</p>
            </div>
            <div>
              <p className="text-xl font-bold text-rock-hover">{myCases.length}</p>
              <p className="text-xs text-steel-light-gray mt-0.5">上传案例</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-rock-blue" />
              <span className="text-sm font-medium text-steel-gray">经销商等级</span>
            </div>
            <span className="text-xs text-rock-blue">{levelInfo.level}</span>
          </div>
          <div className="w-full h-2 bg-steel-light rounded-base overflow-hidden mb-2">
            <div
              className="h-full bg-rock-blue rounded-base"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-steel-light-gray">当前等级</span>
            <span className="text-steel-light-gray">下一级：{levelInfo.nextLevel}</span>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-steel-gray mb-3">我的业务</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {dealerMenuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  variant="default"
                  onClick={() => onNavigate(item.page)}
                  className="!flex-col !bg-transparent !border-0 !shadow-none !gap-2 !p-0 !text-steel-gray hover:!border-0"
                >
                  <div className="w-11 h-11 rounded-base bg-rock-blue/10 flex items-center justify-center">
                    <Icon size={20} className="text-rock-blue" />
                  </div>
                  <span className="text-xs text-steel-gray text-center leading-tight">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border-b border-steel-light-gray last:border-b-0">
                  <Button
                    variant="default"
                    onClick={() => onNavigate(item.page)}
                    className={menuItemBtnClass}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-steel-light-gray" />
                      <span className="text-sm text-steel-gray">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-steel-light-gray" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-steel-gray mb-3">工具与服务</h3>
          <div className="space-y-1">
            {toolItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border-b border-steel-light-gray last:border-b-0">
                  <Button
                    variant="default"
                    onClick={() => item.page && onNavigate(item.page)}
                    className={menuItemBtnClass}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-steel-light-gray" />
                      <span className="text-sm text-steel-gray">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-steel-light-gray" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-steel-light-gray">曜之岩（广州）建材科技有限公司</p>
      </div>
    </div>
  );
}
