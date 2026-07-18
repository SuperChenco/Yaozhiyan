import { useState } from 'react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { PROJECT_TYPES } from '@/constants';

interface InquiryProps {
  onBack: () => void;
}

export default function Inquiry({ onBack }: InquiryProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    projectType: '',
    area: '',
    budget: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const addInquiry = useStore((state) => state.addInquiry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      name: formData.name,
      phone: formData.phone,
      company: formData.company,
      projectType: formData.projectType,
      area: parseFloat(formData.area) || 0,
      budget: formData.budget,
      description: formData.description,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-steel-light flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-status-success/10 rounded-base flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-carbon-black mb-2">提交成功</h2>
        <p className="text-sm text-steel-light-gray mb-6">我们的专业团队将在24小时内与您联系</p>
        <Button onClick={onBack}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="在线询价" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                姓名 <span className="text-status-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入您的姓名"
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                手机号 <span className="text-status-danger">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入您的手机号"
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                公司名称
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="请输入您的公司名称"
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                项目类型 <span className="text-status-danger">*</span>
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                required
              >
                <option value="">请选择项目类型</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                预计面积（㎡）
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="请输入预计面积"
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                预算范围
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
              >
                <option value="">请选择预算范围</option>
                <option value="10万以下">10万以下</option>
                <option value="10-30万">10-30万</option>
                <option value="30-50万">30-50万</option>
                <option value="50-100万">50-100万</option>
                <option value="100万以上">100万以上</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">
                项目描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请描述您的项目需求，如建筑风格、特殊要求等"
                rows={4}
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm resize-none"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              提交询价
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
