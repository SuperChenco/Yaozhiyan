import { useState } from 'react';
import { Calculator, Percent, Settings, ChevronDown, Search } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
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
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="价格查询" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Card className="p-4 mb-4" onClick={() => setShowProductPicker(true)}>
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yaozhiyan-gray-800">{selectedProduct.name}</h3>
              <p className="text-xs text-yaozhiyan-gray-400 mt-0.5">品号：{selectedProduct.code}</p>
              <p className="text-xs text-yaozhiyan-gray-400">{selectedProduct.category}</p>
            </div>
            <ChevronDown size={20} className="text-yaozhiyan-gray-400" />
          </div>
        </Card>

        <Card className="p-6 text-center mb-4">
          <div className="w-16 h-16 bg-yaozhiyan-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator size={32} className="text-yaozhiyan-primary" />
          </div>
          <h2 className="text-xl font-bold text-yaozhiyan-gray-800 mb-2">{selectedProduct.name}</h2>
          <p className="text-sm text-yaozhiyan-gray-500 mb-6">品号：{selectedProduct.code}</p>

          <div className="bg-yaozhiyan-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-yaozhiyan-gray-500 mb-1">官方指导价</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-yaozhiyan-gray-800">¥{selectedProduct.basePrice}</span>
              <span className="text-sm text-yaozhiyan-gray-400">{selectedProduct.unit}</span>
            </div>
          </div>

          {!isAdmin && (
            <>
              <div className="bg-yaozhiyan-primary/5 rounded-lg p-4 mb-4 border border-yaozhiyan-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Percent size={18} className="text-yaozhiyan-primary" />
                  <span className="text-sm text-yaozhiyan-primary">{roleLabel}专属折扣</span>
                  <span className="text-sm font-bold text-yaozhiyan-primary">{Math.round(discount * 100)}%</span>
                </div>
                <p className="text-sm text-yaozhiyan-gray-500">
                  适用区域：{user?.province}
                  {user?.city && ` · ${user.city}`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-yaozhiyan-primary to-yaozhiyan-secondary rounded-lg p-6 text-white">
                <p className="text-sm opacity-80 mb-1">您的拿货价</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl">¥</span>
                  <span className="text-4xl font-bold">{dealerPrice}</span>
                  <span className="text-lg opacity-80">{selectedProduct.unit}</span>
                </div>
              </div>
            </>
          )}

          {isAdmin && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-80 mb-1">管理员视角 - 指导价</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl">¥</span>
                <span className="text-4xl font-bold">{selectedProduct.basePrice}</span>
                <span className="text-lg opacity-80">{selectedProduct.unit}</span>
              </div>
              <p className="text-xs opacity-70 mt-2">各级代理商折扣可后台设置</p>
            </div>
          )}
        </Card>

        {isAdmin && (
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-yaozhiyan-gray-700">各级折扣</h3>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('price-management')}
                  className="flex items-center gap-1 text-xs text-yaozhiyan-primary"
                >
                  <Settings size={12} />
                  调整折扣
                </button>
              )}
            </div>
            <div className="space-y-3">
              {discountList.map((item) => (
                <div key={item.level} className="flex items-center justify-between py-2 border-b border-yaozhiyan-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm text-yaozhiyan-gray-700">{item.level}</p>
                    <p className="text-xs text-yaozhiyan-gray-400">{Math.round(item.discount * 100)}% 折扣</p>
                  </div>
                  <p className="text-sm font-medium text-yaozhiyan-primary">¥{item.price.toFixed(0)}/{selectedProduct.unit}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">价格说明</h3>
          <ul className="space-y-2 text-sm text-yaozhiyan-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yaozhiyan-primary mt-1.5 flex-shrink-0" />
              <span>价格为不含税价格，开票需另计税费</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yaozhiyan-primary mt-1.5 flex-shrink-0" />
              <span>价格包含产品本身，不含运输及安装费用</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yaozhiyan-primary mt-1.5 flex-shrink-0" />
              <span>大额订单可申请总部特殊调价</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yaozhiyan-primary mt-1.5 flex-shrink-0" />
              <span>价格如有变动，以最新通知为准</span>
            </li>
          </ul>
        </Card>
      </div>

      {showProductPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-yaozhiyan-gray-100">
              <h3 className="text-base font-medium text-yaozhiyan-gray-800">选择产品</h3>
              <button
                onClick={() => setShowProductPicker(false)}
                className="text-yaozhiyan-gray-400 hover:text-yaozhiyan-gray-600"
              >
                关闭
              </button>
            </div>

            <div className="px-4 pt-4">
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
                <input
                  type="text"
                  placeholder="搜索产品名称或品号"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-yaozhiyan-gray-50 border border-yaozhiyan-gray-200 rounded-lg text-sm focus:outline-none focus:border-yaozhiyan-primary"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {productCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-yaozhiyan-primary text-white'
                        : 'bg-yaozhiyan-gray-50 text-yaozhiyan-gray-600 border border-yaozhiyan-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductPicker(false);
                      setSearchQuery('');
                    }}
                    className={`p-2 rounded-lg border-2 transition-all text-left ${
                      selectedProduct.id === product.id
                        ? 'border-yaozhiyan-primary bg-yaozhiyan-primary/5'
                        : 'border-yaozhiyan-gray-100'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                    <h4 className="text-sm font-medium text-yaozhiyan-gray-800 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-yaozhiyan-gray-400 line-clamp-1">{product.code}</p>
                    <p className="text-sm font-bold text-yaozhiyan-primary mt-1">¥{product.basePrice}/㎡</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
