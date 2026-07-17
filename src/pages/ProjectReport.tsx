import { useState } from 'react';
import { Plus, MapPin, Calendar, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import { PROJECT_STATUSES, PROJECT_TYPES } from '@/constants';
import { useStore as useUserStore } from '@/store/useStore';

interface ProjectReportProps {
  onBack: () => void;
}

export default function ProjectReport({ onBack }: ProjectReportProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    area: '',
    description: '',
  });
  const projects = useUserStore((state) => state.projects);
  const addProject = useUserStore((state) => state.addProject);
  const user = useUserStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name: formData.name,
      location: formData.location,
      type: formData.type,
      area: parseFloat(formData.area) || 0,
      estimatedCost: (parseFloat(formData.area) || 0) * 236,
      dealerId: user?.id || '',
      description: formData.description,
    });
    setShowForm(false);
    setFormData({ name: '', location: '', type: '', area: '', description: '' });
  };

  const getStatusInfo = (status: string) => {
    return PROJECT_STATUSES.find((s) => s.value === status) || { label: status, color: 'info' };
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
        <Header title="新增项目报备" showBack onBack={() => setShowForm(false)} />
        <div className="px-4 py-4">
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入项目名称"
                  className="w-full px-3 py-2 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                  项目地点 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="请输入项目地点"
                  className="w-full px-3 py-2 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                  项目类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                >
                  <option value="">请选择项目类型</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">
                  预计面积（㎡） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="请输入预计面积"
                  className="w-full px-3 py-2 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">项目描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请描述项目情况"
                  rows={3}
                  className="w-full px-3 py-2 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">提交报备</Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="项目报备" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <Button onClick={() => setShowForm(true)} className="w-full mb-4">
          <Plus size={18} className="mr-2" />
          新增项目报备
        </Button>

        <div className="space-y-3">
          {projects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-yaozhiyan-gray-800">{project.name}</h3>
                  <StatusBadge status={statusInfo.label} color={statusInfo.color as 'success' | 'warning' | 'danger' | 'info'} />
                </div>
                <div className="flex items-center gap-4 text-sm text-yaozhiyan-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {project.location}
                  </span>
                  <span>{project.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span>面积：{project.area}㎡</span>
                    <span className="text-yaozhiyan-primary">预估：¥{(project.estimatedCost / 10000).toFixed(2)}万</span>
                  </div>
                  <span className="flex items-center gap-1 text-yaozhiyan-gray-400">
                    <Calendar size={12} />
                    最后更新：{project.lastUpdate}
                  </span>
                </div>
                {project.description && (
                  <div className="mt-3 pt-3 border-t border-yaozhiyan-gray-100">
                    <p className="text-sm text-yaozhiyan-gray-600 flex items-start gap-2">
                      <FileText size={14} className="flex-shrink-0 mt-0.5" />
                      {project.description}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}