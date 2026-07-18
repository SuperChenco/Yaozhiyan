import { ArrowRight, Phone, Mail, MapPin, FileText, ShoppingCart, Calculator, Users, LayoutDashboard, Grid3X3, Layers } from 'lucide-react';
import { sdcProducts, cases, certifications } from '@/data/mockData';
import { OFFICIAL_SERVICES, OFFICIAL_BANNER_IMAGE } from '@/constants';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const user = useStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const isProvincial = user?.role === 'provincial';

  const dealerQuickActions = [
    { icon: FileText, label: '项目报备', page: 'project-report', color: 'bg-rock-blue/10 text-rock-blue' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'bg-status-success/15 text-status-success' },
    { icon: Calculator, label: '价格查询', page: 'price-inquiry', color: 'bg-rock-hover/15 text-rock-hover' },
    { icon: FileText, label: '在线询价', page: 'inquiry', color: 'bg-status-warn/15 text-status-warn' },
  ];

  const adminQuickActions = [
    { icon: LayoutDashboard, label: '管理后台', page: 'admin-dashboard', color: 'bg-rock-blue/10 text-rock-blue' },
    { icon: Users, label: '经销商管理', page: 'dealer-management', color: 'bg-rock-blue/10 text-rock-blue' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'bg-status-success/15 text-status-success' },
    { icon: FileText, label: '项目审核', page: 'project-review', color: 'bg-status-warn/15 text-status-warn' },
  ];

  const quickActions = isAdmin ? adminQuickActions : dealerQuickActions;

  // 链接型按钮统一覆盖样式：透明背景、无边框无阴影
  const linkBtnClass =
    '!bg-transparent !border-0 !shadow-none !p-0 hover:!border-0';

  // 卡片型按钮统一覆盖样式：透明背景、纵向布局
  const tileBtnClass =
    '!flex-col !bg-transparent !border-0 !shadow-none !gap-2 !p-0 !text-steel-gray hover:!border-0';

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={OFFICIAL_BANNER_IMAGE}
          alt="曜之岩建筑内外墙体系统"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-steel-dark/80" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-steel-white px-4">
          <div className="w-16 h-16 bg-steel-white/20 rounded-base flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">曜</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">曜之岩建材科技</h1>
          <p className="text-steel-white/90 text-sm mb-6 text-center">
            {isAdmin ? '专业的建筑内外墙体系统供应商 · 管理端' : '专业的建筑内外墙体系统供应商'}
          </p>
          <Button variant="outline" size="lg" onClick={() => onNavigate('inquiry')}>
            在线询价
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-carbon-black mb-4">
            {isAdmin ? '管理快捷入口' : '经销商服务'}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  variant="default"
                  onClick={() => onNavigate(item.page)}
                  className={tileBtnClass}
                >
                  <div className={`w-12 h-12 rounded-base ${item.color.split(' ')[0]} flex items-center justify-center`}>
                    <Icon size={22} className={item.color.split(' ')[1]} />
                  </div>
                  <span className="text-xs text-steel-gray">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Grid3X3 size={18} className="text-rock-blue" />
              <h2 className="text-lg font-semibold text-carbon-black">SDC产品系列</h2>
            </div>
            <Button
              variant="default"
              onClick={() => onNavigate('product')}
              className={`${linkBtnClass} !text-rock-blue hover:!text-rock-blue`}
            >
              全部产品
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <p className="text-xs text-steel-light-gray mb-4">
            27款进口SDC轻强混凝土装饰挂板，9大系列，多种肌理可选
          </p>
          <div className="grid grid-cols-4 gap-2">
            {sdcProducts.slice(0, 8).map((product) => (
              <Button
                key={product.id}
                variant="default"
                onClick={() => onNavigate('product')}
                className={`${linkBtnClass} !rounded-base`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square rounded-base object-cover"
                />
              </Button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-steel-light-gray">共 {sdcProducts.length} 款产品</span>
            <span className="text-rock-blue">¥{Math.min(...sdcProducts.map(p => p.basePrice))} 起/㎡</span>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-rock-blue" />
            <h2 className="text-lg font-semibold text-carbon-black">我们的服务</h2>
          </div>
          <div className="space-y-3">
            {OFFICIAL_SERVICES.map((service) => (
              <div key={service.id} className="flex gap-3 p-3 bg-steel-light rounded-base">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-20 h-20 rounded-base object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-semibold text-carbon-black">{service.name}</h3>
                    <span className="text-xs text-steel-light-gray">{service.englishName}</span>
                  </div>
                  <p className="text-xs text-steel-light-gray mt-1 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-carbon-black">成功案例</h2>
          <Button
            variant="default"
            onClick={() => onNavigate('cases')}
            className={`${linkBtnClass} !text-rock-blue hover:!text-rock-blue`}
          >
            更多案例
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cases.slice(0, 4).map((item) => (
            <Card key={item.id} className="overflow-hidden" onClick={() => onNavigate('cases')}>
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-28 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-carbon-black line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-steel-light-gray">{item.location}</span>
                  <span className="text-xs text-steel-light-gray">{item.area}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-carbon-black mb-4">资质认证</h2>
          <div className="grid grid-cols-2 gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 bg-steel-light rounded-base border border-steel-light-gray"
              >
                <h3 className="text-sm font-medium text-carbon-black">{cert.name}</h3>
                <p className="text-xs text-steel-light-gray mt-1">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-carbon-black mb-4">联系我们</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-rock-blue" />
              <span className="text-sm text-steel-gray">176 2157 4543</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-rock-blue" />
              <span className="text-sm text-steel-gray">yaozhiyan2022@126.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-rock-blue" />
              <span className="text-sm text-steel-gray">佛山市华宝南路13号四座首层</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
