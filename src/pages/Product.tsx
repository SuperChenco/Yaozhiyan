import { useState } from 'react';
import { Search, Grid3X3, Ruler, Maximize2 } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { sdcProducts, productCategories } from '@/data/mockData';
import type { Product as ProductType } from '@/types';

interface ProductProps {
  onNavigate: (page: string) => void;
}

export default function Product({ onNavigate }: ProductProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const filteredProducts = sdcProducts.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-steel-light pb-20">
        <Header title={selectedProduct.name} showBack onBack={() => setSelectedProduct(null)} />
        <div className="px-4 py-4">
          <div className="relative rounded-base overflow-hidden mb-4">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-steel-white/90 backdrop-blur-sm px-3 py-1 rounded-base">
              <span className="text-xs text-rock-blue font-medium">
                {selectedProduct.category}
              </span>
            </div>
          </div>

          <Card className="p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-carbon-black">{selectedProduct.name}</h2>
                <p className="text-xs text-steel-light-gray mt-1">品号：{selectedProduct.code}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm text-rock-blue">¥</span>
                  <span className="text-2xl font-bold text-rock-blue">
                    {selectedProduct.basePrice}
                  </span>
                </div>
                <p className="text-xs text-steel-light-gray">{selectedProduct.unit}</p>
              </div>
            </div>
            <p className="text-sm text-steel-gray leading-relaxed">
              {selectedProduct.description}
            </p>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
              <Ruler size={16} className="text-rock-blue" />
              规格参数
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-steel-light rounded-base p-3 text-center">
                <p className="text-xs text-steel-light-gray mb-1">长度</p>
                <p className="text-sm font-medium text-steel-gray">
                  {selectedProduct.length}mm
                </p>
              </div>
              <div className="bg-steel-light rounded-base p-3 text-center">
                <p className="text-xs text-steel-light-gray mb-1">宽度</p>
                <p className="text-sm font-medium text-steel-gray">
                  {selectedProduct.width}mm
                </p>
              </div>
              <div className="bg-steel-light rounded-base p-3 text-center">
                <p className="text-xs text-steel-light-gray mb-1">厚度</p>
                <p className="text-sm font-bold text-rock-blue">
                  {selectedProduct.thickness}mm
                </p>
              </div>
            </div>
            <div className="mt-3 bg-steel-light rounded-base p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-steel-light-gray">单块面积</span>
                <span className="text-sm font-medium text-steel-gray">
                  {((selectedProduct.length * selectedProduct.width) / 1000000).toFixed(3)}㎡
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
              <Grid3X3 size={16} className="text-rock-blue" />
              应用场景
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.applications.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1 bg-rock-blue/5 text-rock-blue text-xs rounded-base"
                >
                  {app}
                </span>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => onNavigate('inquiry')}>
              在线询价
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={() => onNavigate('price-inquiry')}>
              查询拿货价
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="产品中心" />

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
          <input
            type="text"
            placeholder="搜索产品名称或品号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-steel-white border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
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

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-steel-light-gray">
            共 <span className="text-rock-blue font-medium">{filteredProducts.length}</span> 款产品
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-carbon-black line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-steel-light-gray mt-0.5 line-clamp-1">
                  {product.code}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-rock-blue">¥</span>
                    <span className="text-base font-bold text-rock-blue">
                      {product.basePrice}
                    </span>
                    <span className="text-xs text-steel-light-gray">/㎡</span>
                  </div>
                  <span className="text-xs text-steel-light-gray bg-steel-light px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-steel-light-gray">
            <Grid3X3 size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">未找到相关产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
