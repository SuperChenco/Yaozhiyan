import { useState } from 'react';
import { Search, Grid3X3, Ruler, Maximize2 } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
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
      <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
        <Header title={selectedProduct.name} showBack onBack={() => setSelectedProduct(null)} />
        <div className="px-4 py-4">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs text-yaozhiyan-primary font-medium">
                {selectedProduct.category}
              </span>
            </div>
          </div>

          <Card className="p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-yaozhiyan-gray-800">{selectedProduct.name}</h2>
                <p className="text-xs text-yaozhiyan-gray-400 mt-1">品号：{selectedProduct.code}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm text-yaozhiyan-primary">¥</span>
                  <span className="text-2xl font-bold text-yaozhiyan-primary">
                    {selectedProduct.basePrice}
                  </span>
                </div>
                <p className="text-xs text-yaozhiyan-gray-400">{selectedProduct.unit}</p>
              </div>
            </div>
            <p className="text-sm text-yaozhiyan-gray-600 leading-relaxed">
              {selectedProduct.description}
            </p>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3 flex items-center gap-2">
              <Ruler size={16} className="text-yaozhiyan-primary" />
              规格参数
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-yaozhiyan-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-yaozhiyan-gray-400 mb-1">长度</p>
                <p className="text-sm font-medium text-yaozhiyan-gray-700">
                  {selectedProduct.length}mm
                </p>
              </div>
              <div className="bg-yaozhiyan-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-yaozhiyan-gray-400 mb-1">宽度</p>
                <p className="text-sm font-medium text-yaozhiyan-gray-700">
                  {selectedProduct.width}mm
                </p>
              </div>
              <div className="bg-yaozhiyan-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-yaozhiyan-gray-400 mb-1">厚度</p>
                <p className="text-sm font-medium text-yaozhiyan-gray-700">
                  {selectedProduct.thickness}mm
                </p>
              </div>
            </div>
            <div className="mt-3 bg-yaozhiyan-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-yaozhiyan-gray-400">单块面积</span>
                <span className="text-sm font-medium text-yaozhiyan-gray-700">
                  {((selectedProduct.length * selectedProduct.width) / 1000000).toFixed(3)}㎡
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3 flex items-center gap-2">
              <Grid3X3 size={16} className="text-yaozhiyan-primary" />
              应用场景
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.applications.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1 bg-yaozhiyan-primary/5 text-yaozhiyan-primary text-xs rounded-full"
                >
                  {app}
                </span>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('inquiry')}
              className="flex-1 py-3 bg-yaozhiyan-primary text-white rounded-lg text-sm font-medium"
            >
              在线询价
            </button>
            <button
              onClick={() => onNavigate('price-inquiry')}
              className="flex-1 py-3 border border-yaozhiyan-primary text-yaozhiyan-primary rounded-lg text-sm font-medium"
            >
              查询拿货价
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="产品中心" />

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
          <input
            type="text"
            placeholder="搜索产品名称或品号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-yaozhiyan-gray-200 rounded-xl text-sm focus:outline-none focus:border-yaozhiyan-primary transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-yaozhiyan-primary text-white'
                  : 'bg-white text-yaozhiyan-gray-600 border border-yaozhiyan-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-yaozhiyan-gray-400">
            共 <span className="text-yaozhiyan-primary font-medium">{filteredProducts.length}</span> 款产品
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
                <h3 className="text-sm font-medium text-yaozhiyan-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-yaozhiyan-gray-400 mt-0.5 line-clamp-1">
                  {product.code}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-yaozhiyan-primary">¥</span>
                    <span className="text-base font-bold text-yaozhiyan-primary">
                      {product.basePrice}
                    </span>
                    <span className="text-xs text-yaozhiyan-gray-400">/㎡</span>
                  </div>
                  <span className="text-xs text-yaozhiyan-gray-400 bg-yaozhiyan-gray-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-yaozhiyan-gray-400">
            <Grid3X3 size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">未找到相关产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
