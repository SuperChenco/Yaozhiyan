import { ArrowRight, Phone, Mail, MapPin, FileText, ShoppingCart, Calculator, Users, LayoutDashboard, Grid3X3 } from 'lucide-react';
import { sdcProducts, cases, certifications } from '@/data/mockData';
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
    { icon: FileText, label: '项目报备', page: 'project-report', color: 'bg-blue-50 text-blue-500' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'bg-green-50 text-green-500' },
    { icon: Calculator, label: '价格查询', page: 'price-inquiry', color: 'bg-purple-50 text-purple-500' },
    { icon: FileText, label: '在线询价', page: 'inquiry', color: 'bg-amber-50 text-amber-500' },
  ];

  const adminQuickActions = [
    { icon: LayoutDashboard, label: '管理后台', page: 'admin-dashboard', color: 'bg-indigo-50 text-indigo-500' },
    { icon: Users, label: '经销商管理', page: 'dealer-management', color: 'bg-blue-50 text-blue-500' },
    { icon: ShoppingCart, label: '订单管理', page: 'order-management', color: 'bg-green-50 text-green-500' },
    { icon: FileText, label: '项目审核', page: 'project-review', color: 'bg-amber-50 text-amber-500' },
  ];

  const quickActions = isAdmin ? adminQuickActions : dealerQuickActions;

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <div className="relative h-64 bg-gradient-to-br from-yaozhiyan-primary via-yaozhiyan-primaryLight to-yaozhiyan-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">曜</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">曜之岩建材科技</h1>
          <p className="text-white/80 text-sm mb-6">
            {isAdmin ? '专业的建筑内外墙体系统供应商 - 管理端' : '专业的建筑内外墙体系统供应商'}
          </p>
          <Button variant="outline" size="lg" onClick={() => onNavigate('inquiry')}>
            在线询价
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-yaozhiyan-gray-800 mb-4">
            {isAdmin ? '管理快捷入口' : '经销商服务'}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.page)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color.split(' ')[0]} flex items-center justify-center`}>
                    <Icon size={22} className={item.color.split(' ')[1]} />
                  </div>
                  <span className="text-xs text-yaozhiyan-gray-600">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Grid3X3 size={18} className="text-yaozhiyan-primary" />
              <h2 className="text-lg font-semibold text-yaozhiyan-gray-800">SDC产品系列</h2>
            </div>
            <button onClick={() => onNavigate('product')} className="text-sm text-yaozhiyan-primary flex items-center">
              全部产品
              <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <p className="text-xs text-yaozhiyan-gray-500 mb-4">
            27款进口SDC轻强混凝土装饰挂板，9大系列，多种肌理可选
          </p>
          <div className="grid grid-cols-4 gap-2">
            {sdcProducts.slice(0, 8).map((product) => (
              <button
                key={product.id}
                onClick={() => onNavigate('product')}
                className="relative group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-yaozhiyan-gray-400">共 {sdcProducts.length} 款产品</span>
            <span className="text-yaozhiyan-primary">¥{Math.min(...sdcProducts.map(p => p.basePrice))} 起/㎡</span>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-yaozhiyan-gray-800">成功案例</h2>
          <button onClick={() => onNavigate('cases')} className="text-sm text-yaozhiyan-primary flex items-center">
            更多案例
            <ArrowRight size={14} className="ml-1" />
          </button>
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
                <h3 className="text-sm font-medium text-yaozhiyan-gray-800 line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-yaozhiyan-gray-500">{item.location}</span>
                  <span className="text-xs text-yaozhiyan-gray-500">{item.area}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-yaozhiyan-gray-800 mb-4">资质认证</h2>
          <div className="grid grid-cols-2 gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 bg-yaozhiyan-gray-50 rounded-lg border border-yaozhiyan-gray-200"
              >
                <h3 className="text-sm font-medium text-yaozhiyan-gray-800">{cert.name}</h3>
                <p className="text-xs text-yaozhiyan-gray-500 mt-1">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-yaozhiyan-gray-800 mb-4">联系我们</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-yaozhiyan-primary" />
              <span className="text-sm text-yaozhiyan-gray-700">176 2157 4543</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-yaozhiyan-primary" />
              <span className="text-sm text-yaozhiyan-gray-700">yaozhiyan2022@126.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-yaozhiyan-primary" />
              <span className="text-sm text-yaozhiyan-gray-700">佛山市华宝南路13号四座首层</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}