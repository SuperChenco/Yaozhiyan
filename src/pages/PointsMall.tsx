import { useState } from 'react';
import { Gift, FileText, ChevronRight, Coins, MapPin, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import type { PointGoods, PointExchangeRecord } from '@/types';

interface PointsMallProps {
  onBack: () => void;
}

export default function PointsMall({ onBack }: PointsMallProps) {
  const user = useStore((state) => state.user);
  const pointGoods = useStore((state) => state.pointGoods);
  const exchangeRecords = useStore((state) => state.exchangeRecords);
  const redeemGoods = useStore((state) => state.redeemGoods);

  const [activeTab, setActiveTab] = useState<'goods' | 'records'>('goods');
  const [selectedGoods, setSelectedGoods] = useState<PointGoods | null>(null);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  const handleExchange = (goods: PointGoods) => {
    if (user?.points ?? 0 < goods.needPoints) {
      setShowInsufficientPointsModal(true);
      return;
    }
    setSelectedGoods(goods);
    setShowExchangeModal(true);
  };

  const handleConfirmExchange = () => {
    if (!selectedGoods || !receiveAddress.trim()) return;
    if (!user) return;

    redeemGoods(selectedGoods.id, receiveAddress);
    setShowExchangeModal(false);
    setReceiveAddress('');
    setExchangeSuccess(true);
    setTimeout(() => setExchangeSuccess(false), 2000);
  };

  const filteredRecords = exchangeRecords.filter(r => r.userId === user?.id).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  const getShipStatusConfig = (status: PointExchangeRecord['shipStatus']) => {
    return status === 'pending'
      ? { label: '待发货', color: 'warn' as const }
      : { label: '已寄出', color: 'success' as const };
  };

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="积分商城" showBack onBack={onBack} />

      <Card variant="dark" className="mx-4 mt-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins size={20} className="text-status-warn" />
            <span className="text-steel-white/80 text-sm">可用积分</span>
          </div>
          <div className="flex gap-2">
            {/* 替换原生button为Button组件：积分规则链接 */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowRulesModal(true)}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-white/70 hover:!border-0"
            >
              <FileText size={14} className="mr-1" />
              积分规则
            </Button>
            {/* 替换原生button为Button组件：兑换记录链接 */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveTab('records')}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-white/70 hover:!border-0"
            >
              <Gift size={14} className="mr-1" />
              兑换记录
              <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-steel-white">{user?.points?.toLocaleString() || 0}</span>
          <span className="text-steel-white/70 text-sm">积分</span>
        </div>
      </Card>

      <div className="flex items-center justify-center gap-4 mt-4">
        {['goods', 'records'].map((tab) => (
          /* 替换原生button为Button组件：商品/记录tab切换 */
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'default'}
            size="md"
            onClick={() => setActiveTab(tab as 'goods' | 'records')}
          >
            {tab === 'goods' ? '兑换商品' : '兑换记录'}
          </Button>
        ))}
      </div>

      {activeTab === 'goods' && (
        <div className="px-4 mt-4">
          {pointGoods.length === 0 ? (
            <div className="text-center py-16 text-steel-light-gray">
              <Gift size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">暂无兑换商品</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {pointGoods.map((goods) => {
                const isDisabled = goods.status === 'down' || goods.stock <= 0 || (user?.points ?? 0) < goods.needPoints;
                const isOutOfStock = goods.stock <= 0;

                return (
                  <Card
                    key={goods.id}
                    variant="light"
                    className={`p-3 transition-transform duration-150 ${isDisabled ? 'opacity-60' : 'hover:-translate-y-0.5'}`}
                  >
                    <div className="aspect-square bg-steel-light rounded-base overflow-hidden mb-3">
                      <img
                        src={goods.coverImg}
                        alt={goods.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-carbon-black truncate mb-1">
                      {goods.name}
                    </h4>
                    <p className="text-xs text-steel-light-gray line-clamp-2 mb-2">
                      {goods.desc}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Coins size={14} className="text-status-warn" />
                        <span className="text-rock-blue font-bold text-sm">{goods.needPoints}</span>
                      </div>
                      <span className={`text-xs ${isOutOfStock ? 'text-status-danger' : 'text-steel-light-gray'}`}>
                        库存: {goods.stock}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={isDisabled}
                      onClick={() => handleExchange(goods)}
                    >
                      {isOutOfStock ? '已售罄' : isDisabled ? '积分不足' : '立即兑换'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="px-4 mt-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 text-steel-light-gray">
              <Gift size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">暂无兑换记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const statusConfig = getShipStatusConfig(record.shipStatus);
                return (
                  <Card key={record.id} variant="light" className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-steel-light rounded-base overflow-hidden flex-shrink-0">
                        <img
                          src={pointGoods.find(g => g.id === record.goodsId)?.coverImg || ''}
                          alt={record.goodsName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-carbon-black truncate">
                          {record.goodsName}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Coins size={12} className="text-status-warn" />
                          <span className="text-xs text-status-danger">-{record.consumePoints}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-steel-light-gray">
                          <MapPin size={12} />
                          <span className="truncate">{record.receiveAddress}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-steel-light-gray">{record.createTime}</span>
                          <StatusBadge label={statusConfig.label} color={statusConfig.color} />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showExchangeModal && selectedGoods && (
        <div className="fixed inset-0 bg-steel-dark/50 flex items-center justify-center px-4 z-50">
          <Card variant="light" className="w-full max-w-sm p-4">
            <h3 className="text-base font-medium text-carbon-black mb-4">确认兑换</h3>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-20 h-20 bg-steel-light rounded-base overflow-hidden flex-shrink-0">
                <img
                  src={selectedGoods.coverImg}
                  alt={selectedGoods.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-carbon-black">{selectedGoods.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Coins size={14} className="text-status-warn" />
                  <span className="text-rock-blue font-bold">{selectedGoods.needPoints}</span>
                </div>
                <p className="text-xs text-steel-light-gray mt-1">库存: {selectedGoods.stock}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-steel-gray mb-1.5">收货地址</label>
              <textarea
                value={receiveAddress}
                onChange={(e) => setReceiveAddress(e.target.value)}
                placeholder="请输入详细收货地址"
                className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black placeholder:text-steel-light-gray resize-none"
                rows={3}
              />
            </div>
            <div className="bg-steel-light rounded-base p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-steel-gray">可用积分</span>
                <span className="text-sm text-carbon-black">{user?.points?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-steel-gray">兑换消耗</span>
                <span className="text-sm text-status-danger">-{selectedGoods.needPoints}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-steel-light-gray">
                <span className="text-sm font-medium text-carbon-black">兑换后积分</span>
                <span className="text-sm font-bold text-rock-blue">
                  {(user?.points ?? 0) - selectedGoods.needPoints}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="default" fullWidth onClick={() => setShowExchangeModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                fullWidth
                disabled={!receiveAddress.trim()}
                onClick={handleConfirmExchange}
              >
                确认兑换
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showRulesModal && (
        <div className="fixed inset-0 bg-steel-dark/50 flex items-center justify-center px-4 z-50">
          <Card variant="light" className="w-full max-w-sm p-4">
            <h3 className="text-base font-medium text-carbon-black mb-4">积分规则</h3>
            <div className="space-y-3 text-xs text-steel-gray">
              <p>1. 上传项目案例审核通过可获得积分奖励</p>
              <p>2. 项目报备可获得积分奖励</p>
              <p>3. 订单消费每千元可获得相应积分</p>
              <p>4. 积分可用于兑换商城商品</p>
              <p>5. 积分不可兑换现金</p>
            </div>
            <Button variant="primary" fullWidth className="mt-4" onClick={() => setShowRulesModal(false)}>
              我知道了
            </Button>
          </Card>
        </div>
      )}

      {showInsufficientPointsModal && (
        <div className="fixed inset-0 bg-steel-dark/50 flex items-center justify-center px-4 z-50">
          <Card variant="light" className="w-full max-w-sm p-4">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle size={40} className="text-status-warn" />
            </div>
            <h3 className="text-base font-medium text-carbon-black text-center mb-2">积分不足</h3>
            <p className="text-sm text-steel-gray text-center mb-4">
              当前积分不足以兑换该商品，请先赚取更多积分
            </p>
            <div className="bg-steel-light rounded-base p-3 mb-4">
              <p className="text-xs text-steel-gray mb-2">获取积分方式：</p>
              <ul className="space-y-1 text-xs text-steel-gray">
                <li>• 上传项目案例</li>
                <li>• 项目报备</li>
                <li>• 订单消费</li>
              </ul>
            </div>
            <Button variant="primary" fullWidth onClick={() => setShowInsufficientPointsModal(false)}>
              我知道了
            </Button>
          </Card>
        </div>
      )}

      {exchangeSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-steel-dark text-steel-white px-6 py-3 rounded-base shadow-sm z-50 text-sm">
          兑换成功
        </div>
      )}
    </div>
  );
}