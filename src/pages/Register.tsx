import { useState } from 'react';
import { ArrowLeft, User, Phone, Building, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { PROVINCES, DEALER_LEVELS } from '@/constants';

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    level: '',
    province: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const register = useStore((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-yaozhiyan-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-yaozhiyan-gray-800 mb-2">注册成功</h2>
        <p className="text-sm text-yaozhiyan-gray-500 mb-6">我们的审核团队将在3个工作日内与您联系</p>
        <Button onClick={onBack}>返回登录</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="经销商注册" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className="w-full pl-10 pr-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                手机号 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入您的手机号"
                  className="w-full pl-10 pr-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                公司名称 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="请输入公司名称"
                  className="w-full pl-10 pr-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                申请等级 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as 'provincial' | 'city' })}
                className="w-full px-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                required
              >
                <option value="">请选择申请等级</option>
                {DEALER_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                所在省份 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm appearance-none"
                  required
                >
                  <option value="">请选择省份</option>
                  {PROVINCES.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.level === 'city' && (
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                  所在城市 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="请输入城市名称"
                  className="w-full px-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              提交申请
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}