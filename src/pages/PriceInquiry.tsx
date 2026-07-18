import { useState } from 'react';
import { Calculator, Percent, Settings, ChevronDown, Search } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { sdcProducts, productCategories } from '@/data/mockData';
import { USER_ROLES } from '@/constants';

interface PriceInquiryProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function PriceInquiry({ onBack, onNavigate }: PriceInquiryProps) {
  const user = useStore((state) => state.user);
  const discounts = useStore((state) => state.discounts);
  const getDiscount = useStore((state) => state.getDiscount);
  const [selectedProduct, setSelectedProduct] = useState(sdcProducts[0]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const role = user?.role || 'city';
  const discount = getDiscount(role as 'admin' | 'provincial' | 'city');
  const dealerPrice = Math.round(selectedProduct.basePrice * discount * 100) / 100;
  const roleLabel = USER_ROLES.find((r) => r.value === role)?.label || '用户';
  const isAdmin = role === 'admin';

  const filteredProducts = sdcProducts.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const discountList = [
    { level: '省级总代', discount: discounts.provincial, price: selectedProduct.basePrice * discounts.provincial },
    { level: '城市经销商', discount: discounts.city, price: selectedProduct.basePrice * discounts.city },
  ];

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="价格查询" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Card className="p-4 mb-4" onClick={() => setShowProductPicker(true)}>
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-14 h-14 rounded-base object-cover"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-carbon-black">{selectedProduct.name}</h3>
              <p className="text-xs text-steel-light-gray mt-0.5">品号：{selectedProduct.code}</p>
              <p className="text-xs text-steel-light-gray">{selectedProduct.category}</p>
            </div>
            <ChevronDown size={20} className="text-steel-light-gray" />
          </div>
        </Card>

        <Card className="p-6 text-center mb-4">
          <div className="w-16 h-16 bg-rock-blue/10 rounded-base flex items-center justify-center mx-auto mb-4">
            <Calculator size={32} className="text-rock-blue" />
          </div>
          <h2 className="text-xl font-bold text-carbon-black mb-2">{selectedProduct.name}</h2>
          <p className="text-sm text-steel-light-gray mb-6">品号：{selectedProduct.code}</p>

          <div className="bg-steel-light rounded-base p-4 mb-4">
            <p className="text-sm text-steel-light-gray mb-1">官方指导价</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-rock-blue">¥{selectedProduct.basePrice}</span>
              <span className="text-sm text-steel-light-gray">{selectedProduct.unit}</span>
            </div>
          </div>

          {!isAdmin && (
            <>
              <div className="bg-rock-blue/5 rounded-base p-4 mb-4 border border-rock-blue/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Percent size={18} className="text-rock-blue" />
                  <span className="text-sm text-rock-blue">{roleLabel}专属折扣</span>
                  <span className="text-sm font-bold text-rock-blue">{Math.round(discount * 100)}%</span>
                </div>
                <p className="text-sm text-steel-light-gray">
                  适用区域：{user?.province}
                  {user?.city && ` · ${user.city}`}
                </p>
              </div>

              <div className="bg-steel-light rounded-base p-6">
                <p className="text-sm text-steel-light-gray mb-1">您的拿货价</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl text-rock-blue">¥</span>
                  <span className="text-4xl font-bold text-rock-blue">{dealerPrice}</span>
                  <span className="text-lg text-steel-light-gray">{selectedProduct.unit}</span>
                </div>
              </div>
            </>
          )}

          {isAdmin && (
            <div className="bg-steel-light rounded-base p-6">
              <p className="text-sm text-steel-light-gray mb-1">管理员视角 - 指导价</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl text-rock-blue">¥</span>
                <span className="text-4xl font-bold text-rock-blue">{selectedProduct.basePrice}</span>
                <span className="text-lg text-steel-light-gray">{selectedProduct.unit}</span>
              </div>
              <p className="text-xs text-steel-light-gray mt-2">各级代理商折扣可后台设置</p>
            </div>
          )}
        </Card>

        {isAdmin && (
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-steel-gray">各级折扣</h3>
              {onNavigate && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigate('price-management')}
                  className="!bg-transparent !border-0 !shadow-none !p-0 !text-rock-blue hover:!text-rock-blue hover:!border-0"
                >
                  <Settings size={12} />
                  调整折扣
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {discountList.map((item) => (
                <div key={item.level} className="flex items-center justify-between py-2 border-b border-steel-light-gray last:border-b-0">
                  <div>
                    <p className="text-sm text-steel-gray">{item.level}</p>
                    <p className="text-xs text-steel-light-gray">{Math.round(item.discount * 100)}% 折扣</p>
                  </div>
                  <p className="text-sm font-medium text-rock-blue">¥{item.price.toFixed(0)}/{selectedProduct.unit}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="text-sm font-medium text-steel-gray mb-3">价格说明</h3>
          <ul className="space-y-2 text-sm text-steel-gray">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-base bg-rock-blue mt-1.5 flex-shrink-0" />
              <span>价格为不含税价格，开票需另计税费</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-base bg-rock-blue mt-1.5 flex-shrink-0" />
              <span>价格包含产品本身，不含运输及安装费用</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-base bg-rock-blue mt-1.5 flex-shrink-0" />
              <span>大额订单可申请总部特殊调价</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-base bg-rock-blue mt-1.5 flex-shrink-0" />
              <span>价格如有变动，以最新通知为准</span>
            </li>
          </ul>
        </Card>
      </div>

      {showProductPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-steel-white rounded-t-base max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
              <h3 className="text-base font-medium text-carbon-black">选择产品</h3>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowProductPicker(false)}
                className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-light-gray hover:!text-steel-gray hover:!border-0"
              >
                关闭
              </Button>
            </div>

            <div className="px-4 pt-4">
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
                <input
                  type="text"
                  placeholder="搜索产品名称或品号"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-steel-light border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {productCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? 'primary' : 'default'}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex-shrink-0"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="default"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductPicker(false);
                      setSearchQuery('');
                    }}
                    className={`!p-2 !rounded-base !border-2 !transition-all !text-left ${
                      selectedProduct.id === product.id
                        ? '!border-rock-blue !bg-rock-blue/5'
                        : '!border-steel-light-gray'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded-base mb-2"
                    />
                    <h4 className="text-sm font-medium text-carbon-black line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-steel-light-gray line-clamp-1">{product.code}</p>
                    <p className="text-sm font-bold text-rock-blue mt-1">¥{product.basePrice}/㎡</p>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
