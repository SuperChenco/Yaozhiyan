import { useState, useEffect } from 'react';
import { Search, Plus, X, ChevronLeft, ChevronRight, Package, ShoppingBag, Phone, MapPin, User } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import FileUpload from '@/components/FileUpload';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { SDC_CATEGORIES } from '@/api';
import type { SampleProduct, SampleProductForm, SampleSalesRecord, SampleSalesForm, ProductStatus } from '@/types';

const SAMPLE_CATEGORIES = SDC_CATEGORIES;

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  up: { label: '已上架', color: 'success' },
  down: { label: '已下架', color: 'warn' },
  pending: { label: '待付款', color: 'warn' },
  paid: { label: '已付款', color: 'info' },
  shipped: { label: '已发货', color: 'success' },
  delivered: { label: '已签收', color: 'success' },
  completed: { label: '已完成', color: 'success' },
};

export default function SampleSales({ onBack }: { onBack: () => void }) {
  const { isAdmin } = useAuth();
  const {
    sampleProducts,
    sampleProductsTotal,
    sampleProductsPage,
    sampleProductsPageSize,
    sampleSalesRecords,
    sampleSalesTotal,
    sampleSalesPage,
    sampleSalesPageSize,
    fetchSampleProducts,
    addSampleProduct,
    updateSampleProduct,
    deleteSampleProduct,
    publishSampleProduct,
    unpublishSampleProduct,
    fetchSampleSalesRecords,
    createSampleSale,
    updateSampleSaleStatus,
    uploadFile,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<ProductStatus | 'all'>('all');
  const [salesStatus, setSalesStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SampleProduct | null>(null);
  const [formData, setFormData] = useState<SampleProductForm>({
    name: '',
    code: '',
    category: SAMPLE_CATEGORIES[0],
    spec: '',
    basePrice: 0,
    coverImg: '',
    description: '',
    parentProductId: '',
    stock: 0,
    status: 'up',
  });
  const [saleFormData, setSaleFormData] = useState<SampleSalesForm>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    sampleItems: [],
    shippingFee: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<{ sampleId: string; name: string; code: string; price: number; quantity: number }[]>([]);

  const [productsLoading, setProductsLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    fetchSampleProducts({ keyword, category: category === 'all' ? undefined : category, status: status === 'all' ? undefined : status, page: sampleProductsPage, pageSize: sampleProductsPageSize }).finally(() => {
      setProductsLoading(false);
    });
  }, [keyword, category, status, sampleProductsPage]);

  useEffect(() => {
    setSalesLoading(true);
    fetchSampleSalesRecords({ keyword, status: salesStatus === 'all' ? undefined : salesStatus, page: sampleSalesPage, pageSize: sampleSalesPageSize }).finally(() => {
      setSalesLoading(false);
    });
  }, [keyword, salesStatus, sampleSalesPage]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchSampleProducts({ page: 1 });
    } else {
      fetchSampleSalesRecords({ page: 1 });
    }
  }, [activeTab]);

  const handleOpenModal = (product?: SampleProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        code: product.code,
        category: product.category,
        spec: product.spec,
        basePrice: product.basePrice,
        coverImg: product.coverImg,
        description: product.description,
        parentProductId: product.parentProductId,
        stock: product.stock,
        status: product.status,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        code: '',
        category: SAMPLE_CATEGORIES[0],
        spec: '',
        basePrice: 0,
        coverImg: '',
        description: '',
        parentProductId: '',
        stock: 0,
        status: 'up',
      });
    }
    setShowModal(true);
  };

  const handleCoverUpload = async (files: { file?: File; previewUrl?: string }[]) => {
    if (files.length === 0) return;
    const raw = files[0];
    const realFile = raw?.file as File | undefined;
    if (realFile) {
      const result = await uploadFile(realFile);
      if (result) {
        setFormData((prev) => ({ ...prev, coverImg: result.fileUrl }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, coverImg: raw.previewUrl || '' }));
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.code || !formData.coverImg) {
      return;
    }
    if (editingProduct) {
      await updateSampleProduct(editingProduct.id, formData);
    } else {
      await addSampleProduct(formData);
    }
    setShowModal(false);
    fetchSampleProducts({ page: sampleProductsPage });
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm('确定删除该样品吗？');
    if (confirmed) {
      await deleteSampleProduct(id);
      fetchSampleProducts({ page: sampleProductsPage });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ProductStatus) => {
    if (currentStatus === 'up') {
      await unpublishSampleProduct(id);
    } else {
      await publishSampleProduct(id);
    }
  };

  const handleAddToSale = (product: SampleProduct) => {
    const exists = selectedProducts.find((p) => p.sampleId === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.map((p) => (p.sampleId === product.id ? { ...p, quantity: p.quantity + 1 } : p)));
    } else {
      setSelectedProducts([...selectedProducts, { sampleId: product.id, name: product.name, code: product.code, price: product.basePrice, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (sampleId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.sampleId !== sampleId));
    } else {
      setSelectedProducts(selectedProducts.map((p) => (p.sampleId === sampleId ? { ...p, quantity } : p)));
    }
  };

  const handleRemoveFromSale = (sampleId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.sampleId !== sampleId));
  };

  const handleCreateSale = async () => {
    if (!saleFormData.customerName || !saleFormData.customerPhone || !saleFormData.customerAddress || selectedProducts.length === 0) {
      return;
    }
    const sampleItems = selectedProducts.map((p) => ({ sampleId: p.sampleId, quantity: p.quantity }));
    await createSampleSale({ ...saleFormData, sampleItems });
    setShowSaleModal(false);
    setSelectedProducts([]);
    setSaleFormData({ customerName: '', customerPhone: '', customerAddress: '', sampleItems: [], shippingFee: 0 });
    fetchSampleSalesRecords({ page: sampleSalesPage });
  };

  const handleUpdateSaleStatus = async (id: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      pending: 'paid',
      paid: 'shipped',
      shipped: 'delivered',
      delivered: 'completed',
    };
    const nextStatus = nextStatusMap[currentStatus];
    if (nextStatus) {
      await updateSampleSaleStatus(id, nextStatus as any);
    }
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };

  const getActualPayment = () => {
    return getTotalAmount() + saleFormData.shippingFee;
  };

  const renderProductList = () => (
    <div className="px-4 pb-20">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
          <input
            type="text"
            placeholder="搜索样品名称/品号"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              const target = e.target as HTMLInputElement;
              if (e.key === 'Enter') fetchSampleProducts({ keyword: target.value, page: 1 });
            }}
            className="w-full h-10 pl-10 pr-4 rounded-base bg-steel-white border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
          />
        </div>
        <Button size="sm" onClick={() => fetchSampleProducts({ keyword, page: 1 })}>搜索</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            fetchSampleProducts({ category: e.target.value === 'all' ? undefined : e.target.value, page: 1 });
          }}
          className="h-10 px-3 rounded-base bg-steel-white border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
        >
          <option value="all">全部分类</option>
          {SAMPLE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ProductStatus | 'all');
            fetchSampleProducts({ status: e.target.value === 'all' ? undefined : e.target.value as ProductStatus, page: 1 });
          }}
          className="h-10 px-3 rounded-base bg-steel-white border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
        >
          <option value="all">全部状态</option>
          <option value="up">已上架</option>
          <option value="down">已下架</option>
        </select>
        <Button size="sm" className="ml-auto" onClick={() => handleOpenModal()}>新增样品</Button>
      </div>

      {productsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-rock-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sampleProducts.length === 0 ? (
        <Card className="p-8 flex flex-col items-center gap-3">
          <Package size={32} className="text-steel-light-gray" />
          <p className="text-steel-light-gray">暂无样品数据</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sampleProducts.map((product) => (
            <Card key={product.id} variant="light" className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-base overflow-hidden flex-shrink-0 bg-steel-light">
                  {product.coverImg ? (
                    <img src={product.coverImg} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-steel-light-gray">
                      <Package size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-carbon-black truncate">{product.name}</h3>
                    <StatusBadge label={STATUS_MAP[product.status].label} color={STATUS_MAP[product.status].color as 'success' | 'warn' | 'danger'} size="sm" />
                  </div>
                  <p className="text-xs text-steel-light-gray mb-1">品号：{product.code}</p>
                  <p className="text-xs text-steel-light-gray mb-2">分类：{product.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-rock-blue font-medium">¥{product.basePrice}</span>
                      <span className="text-steel-gray">规格：{product.spec}</span>
                      <span className="text-steel-gray">库存：{product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-steel-light">
                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(product.id, product.status)}>
                  {product.status === 'up' ? '下架' : '上架'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleOpenModal(product)}>编辑</Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(product.id)}>删除</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-steel-light-gray">共 {sampleProductsTotal} 条</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={sampleProductsPage <= 1} onClick={() => fetchSampleProducts({ page: sampleProductsPage - 1 })}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-steel-gray">{sampleProductsPage} / {Math.ceil(sampleProductsTotal / sampleProductsPageSize)}</span>
          <Button size="sm" variant="outline" disabled={sampleProductsPage >= Math.ceil(sampleProductsTotal / sampleProductsPageSize)} onClick={() => fetchSampleProducts({ page: sampleProductsPage + 1 })}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSalesList = () => (
    <div className="px-4 pb-20">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
          <input
            type="text"
            placeholder="搜索订单号/客户"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              const target = e.target as HTMLInputElement;
              if (e.key === 'Enter') fetchSampleSalesRecords({ keyword: target.value, page: 1 });
            }}
            className="w-full h-10 pl-10 pr-4 rounded-base bg-steel-white border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
          />
        </div>
        <Button size="sm" onClick={() => fetchSampleSalesRecords({ keyword, page: 1 })}>搜索</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <select
          value={salesStatus}
          onChange={(e) => {
            setSalesStatus(e.target.value);
            fetchSampleSalesRecords({ status: e.target.value === 'all' ? undefined : e.target.value, page: 1 });
          }}
          className="h-10 px-3 rounded-base bg-steel-white border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
        >
          <option value="all">全部状态</option>
          <option value="pending">待付款</option>
          <option value="paid">已付款</option>
          <option value="shipped">已发货</option>
          <option value="delivered">已签收</option>
          <option value="completed">已完成</option>
        </select>
        <Button size="sm" className="ml-auto" onClick={() => setShowSaleModal(true)}>新建销售</Button>
      </div>

      {salesLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-rock-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sampleSalesRecords.length === 0 ? (
        <Card className="p-8 flex flex-col items-center gap-3">
          <ShoppingBag size={32} className="text-steel-light-gray" />
          <p className="text-steel-light-gray">暂无销售记录</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sampleSalesRecords.map((record) => (
            <Card key={record.id} variant="light" className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-carbon-black">订单号：{record.orderNo}</h3>
                <StatusBadge label={STATUS_MAP[record.status].label} color={STATUS_MAP[record.status].color as 'success' | 'warn' | 'danger'} size="sm" />
              </div>
              <div className="flex items-center gap-4 text-xs text-steel-light-gray mb-2">
                <span className="flex items-center gap-1"><User size={12} />{record.customerName}</span>
                <span className="flex items-center gap-1"><Phone size={12} />{record.customerPhone}</span>
              </div>
              <p className="text-xs text-steel-gray mb-2 flex items-start gap-1">
                <MapPin size={12} className="mt-0.5 flex-shrink-0" />{record.customerAddress}
              </p>
              <div className="bg-steel-light rounded-base p-2 mb-2">
                {record.sampleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs mb-1 last:mb-0">
                    <span>{item.sampleName} × {item.quantity}</span>
                    <span className="text-rock-blue">¥{item.totalPrice}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <span>商品金额：<span className="text-carbon-black">¥{record.totalAmount}</span></span>
                  <span>运费：<span className="text-carbon-black">¥{record.shippingFee}</span></span>
                  <span className="text-rock-blue font-medium">实付：¥{record.actualPayment}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleUpdateSaleStatus(record.id, record.status)}>
                  {record.status === 'completed' ? '已完成' : '下一步'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-steel-light-gray">共 {sampleSalesTotal} 条</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={sampleSalesPage <= 1} onClick={() => fetchSampleSalesRecords({ page: sampleSalesPage - 1 })}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-steel-gray">{sampleSalesPage} / {Math.ceil(sampleSalesTotal / sampleSalesPageSize)}</span>
          <Button size="sm" variant="outline" disabled={sampleSalesPage >= Math.ceil(sampleSalesTotal / sampleSalesPageSize)} onClick={() => fetchSampleSalesRecords({ page: sampleSalesPage + 1 })}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="样品销售" showBack onBack={onBack} />

      <div className="flex border-b border-steel-light-gray">
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          className="flex-1 rounded-none border-b-2"
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} className="mr-2" />
          样品管理
        </Button>
        <Button
          variant={activeTab === 'sales' ? 'default' : 'outline'}
          className="flex-1 rounded-none border-b-2"
          onClick={() => setActiveTab('sales')}
        >
          <ShoppingBag size={16} className="mr-2" />
          销售订单
        </Button>
      </div>

      {activeTab === 'products' && renderProductList()}
      {activeTab === 'sales' && renderSalesList()}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-steel-white rounded-t-base max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
              <h2 className="font-medium text-carbon-black">{editingProduct ? '编辑样品' : '新增样品'}</h2>
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm text-steel-gray mb-1">样品名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  placeholder="请输入样品名称"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">品号 *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  placeholder="请输入品号"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">分类 *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                >
                  {SAMPLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-steel-gray mb-1">尺寸规格</label>
                  <input
                    type="text"
                    value={formData.spec}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                    className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                    placeholder="如 300×300×18mm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-steel-gray mb-1">价格（元）*</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">库存数量</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">样品主图 *</label>
                {formData.coverImg ? (
                  <div className="relative w-24 h-24 rounded-base overflow-hidden">
                    <img src={formData.coverImg} alt="主图" className="w-full h-full object-cover" />
                    <Button variant="danger" size="sm" className="absolute top-1 right-1" onClick={() => setFormData({ ...formData, coverImg: '' })}>
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <FileUpload acceptMime="image/*" multiple={false} maxSizeMB={20} onChange={handleCoverUpload} />
                )}
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">样品描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue resize-none"
                  placeholder="请输入样品描述"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">关联产品ID</label>
                <input
                  type="text"
                  value={formData.parentProductId}
                  onChange={(e) => setFormData({ ...formData, parentProductId: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  placeholder="关联的主产品ID"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-2">上架状态</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'up'}
                      onChange={() => setFormData({ ...formData, status: 'up' })}
                      className="accent-rock-blue"
                    />
                    <span className="text-sm">立即上架</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'down'}
                      onChange={() => setFormData({ ...formData, status: 'down' })}
                      className="accent-rock-blue"
                    />
                    <span className="text-sm">暂不上架</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-steel-light-gray">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>取消</Button>
              <Button className="flex-1" onClick={handleSaveProduct}>保存</Button>
            </div>
          </div>
        </div>
      )}

      {showSaleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-steel-white rounded-t-base max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
              <h2 className="font-medium text-carbon-black">新建销售订单</h2>
              <Button variant="outline" size="sm" onClick={() => setShowSaleModal(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm text-steel-gray mb-1">客户姓名 *</label>
                <input
                  type="text"
                  value={saleFormData.customerName}
                  onChange={(e) => setSaleFormData({ ...saleFormData, customerName: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  placeholder="请输入客户姓名"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">联系电话 *</label>
                <input
                  type="tel"
                  value={saleFormData.customerPhone}
                  onChange={(e) => setSaleFormData({ ...saleFormData, customerPhone: e.target.value })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                  placeholder="请输入联系电话"
                />
              </div>
              <div>
                <label className="block text-sm text-steel-gray mb-1">收货地址 *</label>
                <textarea
                  value={saleFormData.customerAddress}
                  onChange={(e) => setSaleFormData({ ...saleFormData, customerAddress: e.target.value })}
                  className="w-full h-20 px-3 py-2 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue resize-none"
                  placeholder="请输入收货地址"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-steel-gray">选择样品</label>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('products')}>去选择</Button>
                </div>
                {selectedProducts.length === 0 ? (
                  <Card className="p-4 text-center text-steel-light-gray text-sm">
                    暂无选中样品，请先在样品管理中选择
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div key={item.sampleId} className="flex items-center justify-between bg-steel-light rounded-base p-2">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-steel-light-gray">{item.code}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.sampleId, item.quantity - 1)}>-</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.sampleId, item.quantity + 1)}>+</Button>
                          </div>
                          <span className="text-rock-blue font-medium">¥{item.price * item.quantity}</span>
                          <Button size="sm" variant="danger" onClick={() => handleRemoveFromSale(item.sampleId)}>
                            <X size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-steel-gray mb-1">运费（元）</label>
                <input
                  type="number"
                  value={saleFormData.shippingFee}
                  onChange={(e) => setSaleFormData({ ...saleFormData, shippingFee: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-base bg-steel-light border border-steel-light-gray text-sm focus:outline-none focus:border-rock-blue"
                />
              </div>

              <div className="bg-rock-blue/5 rounded-base p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-steel-gray">商品金额</span>
                  <span className="text-sm">¥{getTotalAmount()}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-steel-gray">运费</span>
                  <span className="text-sm">¥{saleFormData.shippingFee}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-rock-blue/10">
                  <span className="text-sm font-medium">实付金额</span>
                  <span className="text-lg text-rock-blue font-bold">¥{getActualPayment()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-steel-light-gray">
              <Button variant="outline" className="flex-1" onClick={() => setShowSaleModal(false)}>取消</Button>
              <Button className="flex-1" onClick={handleCreateSale}>创建订单</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}