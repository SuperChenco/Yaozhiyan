import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Tag,
  Layers,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import FileUpload from '@/components/FileUpload';
import { useStore } from '@/store/useStore';
import { useConfirm } from '@/hooks/useConfirm';
import { SDC_CATEGORIES } from '@/api/sdcProduct';
import { formatPrice } from '@/utils';
import type { SdcProduct, SdcProductForm, ProductStatus } from '@/types';

interface ProductManageProps {
  onBack: () => void;
}

const THICKNESS_OPTIONS = ['18mm中空'];
const SPEC_OPTIONS = ['2400×1200mm', '3000×1500mm', '定制尺寸'];

export default function ProductManage({ onBack }: ProductManageProps) {
  const sdcProducts = useStore((state) => state.sdcProducts);
  const sdcProductsTotal = useStore((state) => state.sdcProductsTotal);
  const sdcProductsPage = useStore((state) => state.sdcProductsPage);
  const sdcProductsPageSize = useStore((state) => state.sdcProductsPageSize);
  const fetchSdcProducts = useStore((state) => state.fetchSdcProducts);
  const addSdcProduct = useStore((state) => state.addSdcProduct);
  const updateSdcProduct = useStore((state) => state.updateSdcProduct);
  const deleteSdcProduct = useStore((state) => state.deleteSdcProduct);
  const publishSdcProduct = useStore((state) => state.publishSdcProduct);
  const unpublishSdcProduct = useStore((state) => state.unpublishSdcProduct);
  const uploadFile = useStore((state) => state.uploadFile);

  const { confirm } = useConfirm();

  // 筛选条件
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [submitting, setSubmitting] = useState(false);

  // 弹窗
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SdcProduct | null>(null);

  // 表单
  const [formData, setFormData] = useState<SdcProductForm>({
    name: '',
    code: '',
    category: SDC_CATEGORIES[0],
    thickness: THICKNESS_OPTIONS[0],
    spec: SPEC_OPTIONS[0],
    basePrice: 0,
    coverImg: '',
    detailImgs: [],
    description: '',
    applications: [],
    stock: 0,
    status: 'up',
  });

  // 应用标签输入
  const [appInput, setAppInput] = useState('');

  // 列表加载
  useEffect(() => {
    fetchSdcProducts({
      category: category === 'all' ? undefined : category,
      keyword: keyword || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page: 1,
      pageSize: sdcProductsPageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, statusFilter]);

  const handleSearch = () => {
    fetchSdcProducts({
      category: category === 'all' ? undefined : category,
      keyword: keyword || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page: 1,
      pageSize: sdcProductsPageSize,
    });
  };

  const handlePageChange = (page: number) => {
    fetchSdcProducts({
      category: category === 'all' ? undefined : category,
      keyword: keyword || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      pageSize: sdcProductsPageSize,
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      code: '',
      category: SDC_CATEGORIES[0],
      thickness: THICKNESS_OPTIONS[0],
      spec: SPEC_OPTIONS[0],
      basePrice: 0,
      coverImg: '',
      detailImgs: [],
      description: '',
      applications: [],
      stock: 0,
      status: 'up',
    });
    setAppInput('');
    setShowModal(true);
  };

  const openEditModal = (product: SdcProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      thickness: product.thickness,
      spec: product.spec,
      basePrice: product.basePrice,
      coverImg: product.coverImg,
      detailImgs: [...product.detailImgs],
      description: product.description,
      applications: [...product.applications],
      stock: product.stock,
      status: product.status,
    });
    setAppInput('');
    setShowModal(true);
  };

  const handleDelete = async (product: SdcProduct) => {
    const ok = await confirm({
      title: '删除产品',
      content: `确定删除产品「${product.name}」吗？此操作不可恢复。`,
      confirmText: '删除',
      type: 'danger',
    });
    if (!ok) return;
    setSubmitting(true);
    try {
      await deleteSdcProduct(product.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: SdcProduct) => {
    setSubmitting(true);
    try {
      if (product.status === 'up') {
        await unpublishSdcProduct(product.id);
      } else {
        await publishSdcProduct(product.id);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.category || !formData.coverImg) {
      useStore.setState({ globalError: '请填写必填项（名称、品号、分类、主图）' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateSdcProduct(editingProduct.id, formData);
      } else {
        await addSdcProduct(formData);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // 主图上传
  const handleCoverUpload = async (files: any[]) => {
    if (files.length === 0) return;
    const raw = files[0];
    const realFile = raw?.file as File | undefined;
    if (realFile) {
      const result = await uploadFile(realFile);
      if (result) {
        setFormData({ ...formData, coverImg: result.fileUrl });
        return;
      }
    }
    setFormData({ ...formData, coverImg: raw.previewUrl || '' });
  };

  // 详情图上传
  const handleDetailUpload = async (files: any[]) => {
    const newImgs: string[] = [];
    for (const f of files) {
      const realFile = f?.file as File | undefined;
      if (realFile) {
        const result = await uploadFile(realFile);
        if (result) {
          newImgs.push(result.fileUrl);
          continue;
        }
      }
      if (f.previewUrl) newImgs.push(f.previewUrl);
    }
    setFormData({
      ...formData,
      detailImgs: [...formData.detailImgs, ...newImgs].slice(0, 10),
    });
  };

  const removeDetailImg = (idx: number) => {
    setFormData({
      ...formData,
      detailImgs: formData.detailImgs.filter((_, i) => i !== idx),
    });
  };

  const addApplication = () => {
    const val = appInput.trim();
    if (!val) return;
    if (formData.applications.includes(val)) return;
    setFormData({ ...formData, applications: [...formData.applications, val] });
    setAppInput('');
  };

  const removeApplication = (app: string) => {
    setFormData({ ...formData, applications: formData.applications.filter((a) => a !== app) });
  };

  const totalPages = Math.max(1, Math.ceil(sdcProductsTotal / sdcProductsPageSize));
  const statusTabs = [
    { key: 'all', label: '全部' },
    { key: 'up', label: '已上架' },
    { key: 'down', label: '已下架' },
  ] as const;

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="产品管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        {/* 筛选栏 */}
        <Card className="p-4 mb-4">
          {/* 搜索 */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索产品名称/品号"
              className="w-full pl-9 pr-3 py-2 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
            />
          </div>

          <div className="flex gap-2 mb-3">
            {/* 分类筛选 */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue bg-steel-white"
            >
              <option value="all">全部分类</option>
              {SDC_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleSearch}>
              搜索
            </Button>
          </div>

          {/* 状态 Tabs + 新增 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {statusTabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={statusFilter === tab.key ? 'primary' : 'default'}
                  size="sm"
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            <Button size="sm" onClick={openAddModal}>
              <Plus size={14} className="mr-1" />
              新增
            </Button>
          </div>
        </Card>

        {/* 产品列表 */}
        {sdcProducts.length === 0 ? (
          <div className="text-center py-16 text-steel-light-gray">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无产品数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sdcProducts.map((product) => (
              <Card key={product.id} variant="light" className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-base overflow-hidden flex-shrink-0 bg-steel-light">
                    {product.coverImg ? (
                      <img
                        src={product.coverImg}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-steel-light-gray">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-carbon-black truncate">
                        {product.name}
                      </h4>
                      <StatusBadge
                        label={product.status === 'up' ? '已上架' : '已下架'}
                        color={product.status === 'up' ? 'success' : 'warn'}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-steel-light-gray mb-1.5">
                      <Tag size={12} />
                      <span>{product.code}</span>
                      <span className="text-steel-light-gray">·</span>
                      <Layers size={12} />
                      <span>{product.category}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-lg font-bold text-rock-blue">
                        ¥{formatPrice(product.basePrice)}
                      </span>
                      <span className="text-xs text-steel-light-gray">/㎡</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-steel-light-gray">
                      <div className="flex items-center gap-1">
                        <FileText size={12} />
                        <span>{product.spec}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={12} />
                        <span>库存 {product.stock} ㎡</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-steel-light-gray">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleToggleStatus(product)}
                    className="flex-1"
                  >
                    {product.status === 'up' ? (
                      <>
                        <EyeOff size={14} className="mr-1" />
                        下架
                      </>
                    ) : (
                      <>
                        <Eye size={14} className="mr-1" />
                        上架
                      </>
                    )}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openEditModal(product)}
                    className="flex-1"
                  >
                    <Edit3 size={14} className="mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="flex-1"
                  >
                    <Trash2 size={14} className="mr-1" />
                    删除
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 分页 */}
        {sdcProductsTotal > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => handlePageChange(sdcProductsPage - 1)}
              disabled={sdcProductsPage <= 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-steel-gray px-2">
              {sdcProductsPage} / {totalPages}
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={() => handlePageChange(sdcProductsPage + 1)}
              disabled={sdcProductsPage >= totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-steel-light-gray mt-2">
          共 {sdcProductsTotal} 条产品
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-steel-white rounded-t-base max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
              <h3 className="text-base font-medium text-carbon-black">
                {editingProduct ? '编辑产品' : '新增产品'}
              </h3>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowModal(false)}
                className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-light-gray hover:!text-steel-gray hover:!border-0"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
                  <Tag size={14} />
                  基本信息
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-steel-gray mb-1.5 block">产品名称 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入产品名称"
                      className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-steel-gray mb-1.5 block">产品编号（品号）*</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="如 ORA048HA03"
                      className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-steel-gray mb-1.5 block">产品分类 *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue bg-steel-white"
                      >
                        {SDC_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-steel-gray mb-1.5 block">厚度规格</label>
                      <select
                        value={formData.thickness}
                        onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                        className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue bg-steel-white"
                      >
                        {THICKNESS_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-steel-gray mb-1.5 block">尺寸规格</label>
                      <select
                        value={formData.spec}
                        onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                        className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue bg-steel-white"
                      >
                        {SPEC_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-steel-gray mb-1.5 block">基准指导价（元/㎡）*</label>
                      <input
                        type="number"
                        value={formData.basePrice || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="345"
                        className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-steel-gray mb-1.5 block">库存数量（㎡）</label>
                    <input
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                      }
                      placeholder="5000"
                      className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 产品主图 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
                  <ImageIcon size={14} />
                  产品主图 *
                </h4>
                {formData.coverImg ? (
                  <div className="relative w-28 h-28">
                    <img
                      src={formData.coverImg}
                      alt=""
                      className="w-full h-full object-cover rounded-base"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setFormData({ ...formData, coverImg: '' })}
                      className="!absolute !-top-1.5 !-right-1.5 !w-5 !h-5 !p-0 !rounded-base"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <FileUpload
                    acceptMime="image/*"
                    multiple={false}
                    maxSizeMB={20}
                    onChange={handleCoverUpload}
                  />
                )}
              </div>

              {/* 详情多图 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
                  <Layers size={14} />
                  详情图片 <span className="text-xs text-steel-light-gray font-normal">（最多10张）</span>
                </h4>
                {formData.detailImgs.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {formData.detailImgs.map((img, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover rounded-base"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeDetailImg(idx)}
                          className="!absolute !-top-1.5 !-right-1.5 !w-5 !h-5 !p-0 !rounded-base"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {formData.detailImgs.length < 10 && (
                  <FileUpload
                    acceptMime="image/*"
                    multiple
                    maxCount={10 - formData.detailImgs.length}
                    maxSizeMB={20}
                    onChange={handleDetailUpload}
                  />
                )}
              </div>

              {/* 产品描述 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
                  <FileText size={14} />
                  产品简介
                </h4>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入产品特性、适用场景等描述"
                  rows={4}
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors resize-none"
                />
              </div>

              {/* 应用场景 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3 flex items-center gap-2">
                  <Package size={14} />
                  应用场景标签
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.applications.map((app) => (
                    <span
                      key={app}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-rock-blue/10 text-rock-blue text-xs rounded-base"
                    >
                      {app}
                      <button
                        onClick={() => removeApplication(app)}
                        className="text-rock-blue/60 hover:text-rock-blue"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appInput}
                    onChange={(e) => setAppInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addApplication();
                      }
                    }}
                    placeholder="输入标签后按回车添加，如 别墅/办公楼"
                    className="flex-1 px-3 py-2 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                  />
                  <Button variant="default" size="sm" onClick={addApplication}>
                    添加
                  </Button>
                </div>
              </div>

              {/* 上架状态 */}
              <div>
                <h4 className="text-sm font-medium text-steel-gray mb-3">上架状态</h4>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm text-carbon-black cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === 'up'}
                      onChange={() => setFormData({ ...formData, status: 'up' })}
                      className="accent-rock-blue"
                    />
                    立即上架
                  </label>
                  <label className="flex items-center gap-2 text-sm text-carbon-black cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === 'down'}
                      onChange={() => setFormData({ ...formData, status: 'down' })}
                      className="accent-rock-blue"
                    />
                    暂不上架
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-steel-light-gray flex gap-3">
              <Button variant="default" fullWidth onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button variant="primary" fullWidth loading={submitting} onClick={handleSubmit}>
                {editingProduct ? '保存修改' : '新增产品'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
