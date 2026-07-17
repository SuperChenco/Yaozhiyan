import { useState } from 'react';
import { DollarSign, Save, RotateCcw, TrendingDown, Info } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { sdcProduct } from '@/data/mockData';

interface PriceManagementProps {
  onBack: () => void;
}

export default function PriceManagement({ onBack }: PriceManagementProps) {
  const discounts = useStore((state) => state.discounts);
  const updateDiscount = useStore((state) => state.updateDiscount);
  const [provincialDiscount, setProvincialDiscount] = useState(discounts.provincial);
  const [cityDiscount, setCityDiscount] = useState(discounts.city);
  const [showSaved, setShowSaved] = useState(false);

  const basePrice = sdcProduct.basePrice;
  const provincialPrice = Math.round(basePrice * provincialDiscount);
  const cityPrice = Math.round(basePrice * cityDiscount);

  const handleSave = () => {
    updateDiscount('provincial', provincialDiscount);
    updateDiscount('city', cityDiscount);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleReset = () => {
    setProvincialDiscount(0.7);
    setCityDiscount(0.85);
  };

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="价格管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yaozhiyan-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-yaozhiyan-primary" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-yaozhiyan-gray-800">SDC轻强混凝土装饰挂板</h2>
              <p className="text-xs text-yaozhiyan-gray-500">产品代码：{sdcProduct.code}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-yaozhiyan-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yaozhiyan-gray-500">官方指导价</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-yaozhiyan-gray-800">¥{basePrice}</span>
                <span className="text-xs text-yaozhiyan-gray-400">/{sdcProduct.unit}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-4">折扣设置</h3>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yaozhiyan-primary" />
                  <span className="text-sm text-yaozhiyan-gray-700">省级总代折扣</span>
                </div>
                <span className="text-lg font-bold text-yaozhiyan-primary">
                  {Math.round(provincialDiscount * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.01"
                value={provincialDiscount}
                onChange={(e) => setProvincialDiscount(parseFloat(e.target.value))}
                className="w-full accent-yaozhiyan-primary"
              />
              <div className="flex items-center justify-between mt-1 text-xs text-yaozhiyan-gray-400">
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="mt-3 bg-yaozhiyan-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-yaozhiyan-gray-500">省级总代拿货价</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-yaozhiyan-gray-800">¥{provincialPrice}</span>
                  <span className="text-xs text-yaozhiyan-gray-400">/{sdcProduct.unit}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yaozhiyan-secondary" />
                  <span className="text-sm text-yaozhiyan-gray-700">城市经销商折扣</span>
                </div>
                <span className="text-lg font-bold text-yaozhiyan-secondary">
                  {Math.round(cityDiscount * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.01"
                value={cityDiscount}
                onChange={(e) => setCityDiscount(parseFloat(e.target.value))}
                className="w-full accent-yaozhiyan-secondary"
              />
              <div className="flex items-center justify-between mt-1 text-xs text-yaozhiyan-gray-400">
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="mt-3 bg-yaozhiyan-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-yaozhiyan-gray-500">城市经销商拿货价</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-yaozhiyan-gray-800">¥{cityPrice}</span>
                  <span className="text-xs text-yaozhiyan-gray-400">/{sdcProduct.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-yaozhiyan-secondary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yaozhiyan-gray-500 space-y-1">
              <p>折扣设置后，各级代理商在价格查询页面将看到对应的拿货价。</p>
              <p>省级总代折扣应低于城市经销商折扣（折扣率越低，拿货价越低）。</p>
              <p>针对特殊项目，可在订单详情中单独调整价格。</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <RotateCcw size={16} className="mr-2" />
            恢复默认
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save size={16} className="mr-2" />
            保存设置
          </Button>
        </div>

        {showSaved && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-yaozhiyan-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm">
            折扣设置已保存
          </div>
        )}
      </div>
    </div>
  );
}
