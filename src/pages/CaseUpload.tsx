import { useState } from 'react';
import { Upload, Image as ImageIcon, MapPin, Grid3X3, FileText, Plus, X, Gift, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { sdcProducts } from '@/data/mockData';
import { PROVINCES, PROJECT_TYPES, POINT_RULES } from '@/constants';

interface CaseUploadProps {
  onBack: () => void;
}

const sampleImage = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20building%20exterior%20concrete%20wall%20cladding%20project%20photo%20architecture&image_size=square';

export default function CaseUpload({ onBack }: CaseUploadProps) {
  const uploadCase = useStore((state) => state.uploadCase);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    area: '',
    productId: '',
    productName: '',
    description: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = () => {
    if (images.length >= 6) return;
    setImages([...images, sampleImage + `?t=${Date.now()}`]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.type || !formData.productId) {
      return;
    }

    uploadCase({
      name: formData.name,
      location: formData.location,
      type: formData.type,
      area: parseFloat(formData.area) || 0,
      productId: formData.productId,
      productName: formData.productName,
      description: formData.description,
      images: images.length > 0 ? images : [sampleImage],
    });

    setSubmitted(true);
  };

  const selectedProduct = sdcProducts.find((p) => p.id === formData.productId);

  if (submitted) {
    return (
      <div className="min-h-screen bg-steel-light">
        <Header title="上传成功" showBack onBack={onBack} />
        <div className="px-4 py-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-status-success/15 rounded-base flex items-center justify-center mx-auto mb-4">
              <Gift size={32} className="text-status-success" />
            </div>
            <h2 className="text-lg font-bold text-carbon-black mb-2">案例提交成功</h2>
            <p className="text-sm text-steel-light-gray mb-6">
              案例已提交审核，审核通过后将获得积分奖励
            </p>
            <div className="bg-status-warn/15 rounded-base p-4 mb-6">
              <p className="text-sm text-status-warn mb-1">审核通过后可获得</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-status-warn">+{POINT_RULES.upload_case_approved}</span>
                <span className="text-sm text-status-warn">积分</span>
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={onBack}>
              返回
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-24">
      <Header title="上传项目案例" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="border border-status-warn/30 rounded-base p-4 mb-4">
          <div className="flex items-start gap-3">
            <Gift size={20} className="text-status-warn flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-status-warn">上传案例赚积分</p>
              <p className="text-xs text-status-warn mt-1">
                审核通过后可获得 <span className="font-bold">+{POINT_RULES.upload_case_approved} 积分</span> 奖励
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-4">项目信息</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">项目名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入项目名称"
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    项目地点 *
                  </span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors bg-steel-white"
                >
                  <option value="">请选择省份</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">
                  <span className="flex items-center gap-1">
                    <Grid3X3 size={14} />
                    项目类型 *
                  </span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors bg-steel-white"
                >
                  <option value="">请选择项目类型</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">项目面积（㎡）</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="请输入项目面积"
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">
                  <span className="flex items-center gap-1">
                    <Grid3X3 size={14} />
                    使用产品 *
                  </span>
                </label>
                {/* 产品选择触发器：覆盖Button为字段样式 */}
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setShowProductPicker(true)}
                  className="!w-full !flex !items-center !justify-between !px-3 !py-2.5 !bg-steel-white !text-sm !font-normal"
                >
                  <span className={formData.productName ? 'text-carbon-black' : 'text-steel-light-gray'}>
                    {formData.productName || '请选择产品'}
                  </span>
                  <ChevronDown size={18} className="text-steel-light-gray" />
                </Button>
              </div>

              <div>
                <label className="text-sm text-steel-gray mb-1.5 block">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    项目描述
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请描述项目特点、应用场景、客户反馈等"
                  rows={4}
                  className="w-full px-3 py-2.5 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-rock-blue transition-colors resize-none"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-3">
              项目图片 <span className="text-xs text-steel-light-gray font-normal">（最多6张）</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-base" />
                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => removeImage(index)}
                    className="!absolute !-top-1.5 !-right-1.5 !w-5 !h-5 !p-0 !rounded-base"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              {images.length < 6 && (
                /* 图片上传虚框按钮 */
                <Button
                  variant="default"
                  type="button"
                  onClick={handleImageUpload}
                  className="!aspect-square !w-full !h-auto !p-0 !border-2 !border-dashed !border-steel-light-gray !bg-transparent !shadow-none !flex !flex-col !items-center !justify-center !text-steel-light-gray hover:!border-rock-blue hover:!text-rock-blue"
                >
                  <Plus size={24} />
                  <span className="text-xs mt-1">上传图片</span>
                </Button>
              )}
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-steel-white border-t border-steel-light-gray p-4">
            <Button type="submit" variant="primary" size="lg" fullWidth>
              <Upload size={16} className="mr-2" />
              提交审核
            </Button>
          </div>
        </form>
      </div>

      {showProductPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-steel-white rounded-t-base max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
              <h3 className="text-base font-medium text-carbon-black">选择产品</h3>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowProductPicker(false)}
                className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-light-gray hover:!text-steel-gray hover:!border-0"
              >
                取消
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {sdcProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="default"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        productId: product.id,
                        productName: `${product.name}（${product.code}）`,
                      });
                      setShowProductPicker(false);
                    }}
                    className={`!w-full !flex !items-center !gap-3 !p-2 !rounded-base !border-2 !transition-all !text-left ${
                      formData.productId === product.id
                        ? '!border-rock-blue !bg-rock-blue/5'
                        : '!border-steel-light-gray'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-12 h-12 rounded-base object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-carbon-black truncate">{product.name}</p>
                      <p className="text-xs text-steel-light-gray">{product.code}</p>
                    </div>
                    <span className="text-sm font-medium text-rock-blue">¥{product.basePrice}</span>
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
