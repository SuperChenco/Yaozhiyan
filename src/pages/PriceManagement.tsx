import { useState } from 'react';
import { DollarSign, Save, RotateCcw, TrendingDown, Info, Plus, Edit3, Package, FileText, MapPin, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import FileUpload from '@/components/FileUpload';
import { useStore } from '@/store/useStore';
import { sdcProduct } from '@/data/mockData';
import type { PointGoods, PointExchangeRecord } from '@/types';

interface PriceManagementProps {
  onBack: () => void;
}

export default function PriceManagement({ onBack }: PriceManagementProps) {
  const discounts = useStore((state) => state.discounts);
  const updateDiscount = useStore((state) => state.updateDiscount);
  const pointGoods = useStore((state) => state.pointGoods);
  const exchangeRecords = useStore((state) => state.exchangeRecords);
  const addPointGoods = useStore((state) => state.addPointGoods);
  const updatePointGoods = useStore((state) => state.updatePointGoods);
  const updateShipStatus = useStore((state) => state.updateShipStatus);

  const [activeTab, setActiveTab] = useState<'discount' | 'goods'>('discount');
  const [provincialDiscount, setProvincialDiscount] = useState(discounts.provincial);
  const [cityDiscount, setCityDiscount] = useState(discounts.city);
  const [showSaved, setShowSaved] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderTab, setShowOrderTab] = useState(false);

  const [newGoods, setNewGoods] = useState({
    name: '',
    needPoints: 0,
    stock: 0,
    desc: '',
    coverImg: '',
  });

  const [editingGoods, setEditingGoods] = useState<PointGoods | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const basePrice = sdcProduct.basePrice;
  const provincialPrice = Math.round(basePrice * provincialDiscount);
  const cityPrice = Math.round(basePrice * cityDiscount);

  const handleSaveDiscount = () => {
    updateDiscount('provincial', provincialDiscount);
    updateDiscount('city', cityDiscount);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleResetDiscount = () => {
    setProvincialDiscount(0.7);
    setCityDiscount(0.85);
  };

  const handleFileUpload = (files: any[]) => {
    setUploadedImages(files);
    if (files.length > 0 && files[0].previewUrl) {
      setNewGoods((prev) => ({ ...prev, coverImg: files[0].previewUrl }));
    }
  };

  const handleAddGoods = () => {
    if (!newGoods.name || !newGoods.coverImg || newGoods.needPoints <= 0 || newGoods.stock <= 0) {
      return;
    }
    addPointGoods({
      id: `goods-${Date.now()}`,
      name: newGoods.name,
      coverImg: newGoods.coverImg,
      needPoints: newGoods.needPoints,
      stock: newGoods.stock,
      desc: newGoods.desc,
      status: 'up' as const,
    });
    setNewGoods({ name: '', needPoints: 0, stock: 0, desc: '', coverImg: '' });
    setUploadedImages([]);
    setShowAddModal(false);
  };

  const handleEditGoods = () => {
    if (!editingGoods) return;
    updatePointGoods(editingGoods.id, editingGoods);
    setEditingGoods(null);
    setShowEditModal(false);
  };

  const getStatusConfig = (status: PointGoods['status']) => {
    return status === 'up'
      ? { label: '上架', color: 'success' as const }
      : { label: '下架', color: 'danger' as const };
  };

  const getShipStatusConfig = (status: PointExchangeRecord['shipStatus']) => {
    return status === 'pending'
      ? { label: '待发货', color: 'warn' as const }
      : { label: '已寄出', color: 'success' as const };
  };

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="价格管理" showBack onBack={onBack} />

      {activeTab === 'discount' && (
        <div className="px-4 py-4">
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rock-blue/10 rounded-base flex items-center justify-center">
                <DollarSign size={20} className="text-rock-blue" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-carbon-black">SDC轻强混凝土装饰挂板</h2>
                <p className="text-xs text-steel-light-gray">产品代码：{sdcProduct.code}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-steel-light-gray">
              <div className="flex items-center justify-between">
                <span className="text-sm text-steel-light-gray">官方指导价</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-rock-blue">¥{basePrice}</span>
                  <span className="text-xs text-steel-light-gray">/{sdcProduct.unit}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-4">折扣设置</h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-base bg-rock-blue" />
                    <span className="text-sm text-steel-gray">省级总代折扣</span>
                  </div>
                  <span className="text-lg font-bold text-rock-blue">
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
                  className="w-full accent-rock-blue"
                />
                <div className="flex items-center justify-between mt-1 text-xs text-steel-light-gray">
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="mt-3 bg-steel-light rounded-base p-3 flex items-center justify-between">
                  <span className="text-xs text-steel-light-gray">省级总代拿货价</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-rock-blue">¥{provincialPrice}</span>
                    <span className="text-xs text-steel-light-gray">/{sdcProduct.unit}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-base bg-rock-hover" />
                    <span className="text-sm text-steel-gray">城市经销商折扣</span>
                  </div>
                  <span className="text-lg font-bold text-rock-blue">
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
                  className="w-full accent-rock-blue"
                />
                <div className="flex items-center justify-between mt-1 text-xs text-steel-light-gray">
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="mt-3 bg-steel-light rounded-base p-3 flex items-center justify-between">
                  <span className="text-xs text-steel-light-gray">城市经销商拿货价</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-rock-blue">¥{cityPrice}</span>
                    <span className="text-xs text-steel-light-gray">/{sdcProduct.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-rock-hover mt-0.5 flex-shrink-0" />
              <div className="text-xs text-steel-light-gray space-y-1">
                <p>折扣设置后，各级代理商在价格查询页面将看到对应的拿货价。</p>
                <p>省级总代折扣应低于城市经销商折扣（折扣率越低，拿货价越低）。</p>
                <p>针对特殊项目，可在订单详情中单独调整价格。</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetDiscount} className="flex-1">
              <RotateCcw size={16} className="mr-2" />
              恢复默认
            </Button>
            <Button onClick={handleSaveDiscount} className="flex-1">
              <Save size={16} className="mr-2" />
              保存设置
            </Button>
          </div>

          {showSaved && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-steel-dark text-steel-white px-6 py-3 rounded-base shadow-sm z-50 text-sm">
              折扣设置已保存
            </div>
          )}
        </div>
      )}

      {activeTab === 'goods' && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={!showOrderTab ? 'primary' : 'default'}
                size="sm"
                onClick={() => setShowOrderTab(false)}
              >
                商品管理
              </Button>
              <Button
                variant={showOrderTab ? 'primary' : 'default'}
                size="sm"
                onClick={() => setShowOrderTab(true)}
              >
                兑换订单
              </Button>
            </div>
            {!showOrderTab && (
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                <Plus size={16} className="mr-1" />
                新增商品
              </Button>
            )}
          </div>

          {!showOrderTab && (
            <div className="space-y-3">
              {pointGoods.length === 0 ? (
                <div className="text-center py-12 text-steel-light-gray">
                  <Package size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无积分商品</p>
                </div>
              ) : (
                pointGoods.map((goods) => {
                  const statusConfig = getStatusConfig(goods.status);
                  return (
                    <Card key={goods.id} variant="light" className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-steel-light rounded-base overflow-hidden flex-shrink-0">
                          <img
                            src={goods.coverImg}
                            alt={goods.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-carbon-black">{goods.name}</h4>
                            <StatusBadge label={statusConfig.label} color={statusConfig.color} />
                          </div>
                          <p className="text-xs text-steel-light-gray mt-1 line-clamp-1">{goods.desc}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <FileText size={12} className="text-status-warn" />
                              <span className="text-xs text-rock-blue font-bold">{goods.needPoints}</span>
                            </div>
                            <span className="text-xs text-steel-light-gray">库存: {goods.stock}</span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setEditingGoods(goods);
                            setShowEditModal(true);
                          }}
                          className="!flex-shrink-0 !p-2 !bg-transparent !border-0 !shadow-none !text-steel-light-gray hover:!text-rock-blue hover:!border-0"
                        >
                          <Edit3 size={18} />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {showOrderTab && (
            <div className="space-y-3">
              {exchangeRecords.length === 0 ? (
                <div className="text-center py-12 text-steel-light-gray">
                  <FileText size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无兑换订单</p>
                </div>
              ) : (
                exchangeRecords.map((record) => {
                  const statusConfig = getShipStatusConfig(record.shipStatus);
                  const goods = pointGoods.find((g) => g.id === record.goodsId);
                  return (
                    <Card key={record.id} variant="light" className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 bg-steel-light rounded-base overflow-hidden flex-shrink-0">
                          <img
                            src={goods?.coverImg || ''}
                            alt={record.goodsName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-carbon-black">{record.goodsName}</h4>
                          <p className="text-xs text-steel-light-gray mt-0.5">
                            兑换人：{record.userName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <FileText size={12} className="text-status-danger" />
                            <span className="text-xs text-status-danger">-{record.consumePoints}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-steel-light-gray">
                            <MapPin size={12} />
                            <span className="truncate">{record.receiveAddress}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-steel-light-gray">{record.createTime}</span>
                            <div className="flex items-center gap-2">
                              <StatusBadge label={statusConfig.label} color={statusConfig.color} />
                              {record.shipStatus === 'pending' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => updateShipStatus(record.id, 'shipped')}
                                  className="!bg-transparent !border-0 !shadow-none !p-0 !text-rock-blue !font-medium hover:!text-rock-blue hover:!border-0"
                                >
                                  确认发货
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-steel-white border-t border-steel-light-gray px-4 py-3 flex gap-2">
        {/* 替换原生button为Button组件：折扣管理tab */}
        <Button
          variant={activeTab === 'discount' ? 'primary' : 'default'}
          size="md"
          fullWidth
          onClick={() => setActiveTab('discount')}
        >
          折扣管理
        </Button>
        {/* 替换原生button为Button组件：积分商品管理tab */}
        <Button
          variant={activeTab === 'goods' ? 'primary' : 'default'}
          size="md"
          fullWidth
          onClick={() => setActiveTab('goods')}
        >
          积分商品管理
        </Button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-steel-dark/50 flex items-end justify-center z-50">
          <Card variant="light" className="w-full max-w-lg p-4 rounded-t-base">
            <h3 className="text-base font-medium text-carbon-black mb-4">新增积分商品</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">商品封面图</label>
                <FileUpload
                  value={uploadedImages}
                  onChange={handleFileUpload}
                  accept={['jpg', 'jpeg', 'png', 'webp']}
                  maxCount={1}
                  maxSizeMB={5}
                />
              </div>
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">商品名称</label>
                <input
                  type="text"
                  value={newGoods.name}
                  onChange={(e) => setNewGoods((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入商品名称"
                  className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black placeholder:text-steel-light-gray"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-steel-gray mb-1.5">所需积分</label>
                  <input
                    type="number"
                    min="1"
                    value={newGoods.needPoints || ''}
                    onChange={(e) => setNewGoods((prev) => ({ ...prev, needPoints: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black placeholder:text-steel-light-gray"
                  />
                </div>
                <div>
                  <label className="block text-xs text-steel-gray mb-1.5">库存数量</label>
                  <input
                    type="number"
                    min="1"
                    value={newGoods.stock || ''}
                    onChange={(e) => setNewGoods((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black placeholder:text-steel-light-gray"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">商品简介</label>
                <textarea
                  value={newGoods.desc}
                  onChange={(e) => setNewGoods((prev) => ({ ...prev, desc: e.target.value }))}
                  placeholder="请输入商品简介"
                  className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black placeholder:text-steel-light-gray resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="default" fullWidth onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                fullWidth
                disabled={!newGoods.name || !newGoods.coverImg || newGoods.needPoints <= 0 || newGoods.stock <= 0}
                onClick={handleAddGoods}
              >
                确认添加
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showEditModal && editingGoods && (
        <div className="fixed inset-0 bg-steel-dark/50 flex items-end justify-center z-50">
          <Card variant="light" className="w-full max-w-lg p-4 rounded-t-base">
            <h3 className="text-base font-medium text-carbon-black mb-4">编辑积分商品</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-steel-light rounded-base overflow-hidden">
                  <img
                    src={editingGoods.coverImg}
                    alt={editingGoods.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-steel-light-gray">封面图暂不支持修改</span>
              </div>
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">商品名称</label>
                <input
                  type="text"
                  value={editingGoods.name}
                  onChange={(e) => setEditingGoods((prev) => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-steel-gray mb-1.5">所需积分</label>
                  <input
                    type="number"
                    min="1"
                    value={editingGoods.needPoints}
                    onChange={(e) => setEditingGoods((prev) => prev ? { ...prev, needPoints: parseInt(e.target.value) || 0 } : null)}
                    className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-steel-gray mb-1.5">库存数量</label>
                  <input
                    type="number"
                    min="0"
                    value={editingGoods.stock}
                    onChange={(e) => setEditingGoods((prev) => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                    className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">商品简介</label>
                <textarea
                  value={editingGoods.desc}
                  onChange={(e) => setEditingGoods((prev) => prev ? { ...prev, desc: e.target.value } : null)}
                  className="w-full p-3 bg-steel-light rounded-base border border-steel-light-gray text-sm text-carbon-black resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs text-steel-gray mb-1.5">上架状态</label>
                <div className="flex gap-2">
                  {/* 替换原生button为Button组件：上架状态切换 */}
                  <Button
                    variant={editingGoods.status === 'up' ? 'primary' : 'default'}
                    size="md"
                    fullWidth
                    onClick={() => setEditingGoods((prev) => prev ? { ...prev, status: 'up' } : null)}
                  >
                    上架
                  </Button>
                  <Button
                    variant={editingGoods.status === 'down' ? 'danger' : 'default'}
                    size="md"
                    fullWidth
                    onClick={() => setEditingGoods((prev) => prev ? { ...prev, status: 'down' } : null)}
                  >
                    下架
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="default" fullWidth onClick={() => setShowEditModal(false)}>
                取消
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleEditGoods}
              >
                保存修改
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}