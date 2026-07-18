import { useState } from 'react';
import { Plus, MapPin, Calendar, FileText, FileImage, Download } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import FileUpload from '@/components/FileUpload';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { exportProjects, formatFileSize } from '@/utils';
import { PROJECT_STATUSES, PROJECT_TYPES } from '@/constants';
import { useStore as useUserStore } from '@/store/useStore';
import type { Project } from '@/types';

interface ProjectReportProps {
  onBack: () => void;
}

interface DrawFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadTime: string;
}

export default function ProjectReport({ onBack }: ProjectReportProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    area: '',
    description: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<DrawFile[]>([]);
  const projects = useUserStore((state) => state.projects);
  const addProject = useUserStore((state) => state.addProject);
  const uploadFile = useUserStore((state) => state.uploadFile);
  const user = useUserStore((state) => state.user);
  const { isAdmin, isProvincial } = useAuth();
  const canExport = isAdmin || isProvincial;

  const handleExport = () => {
    const ok = exportProjects(projects, { filename: '项目台账' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };

  // 图纸上传：FileUpload 组件 onChange 触发后，逐个调用后端 OSS 接口拿真实 URL
  const handleFileChange = async (files: any[]) => {
    const existing = uploadedFiles;
    const existingNames = new Set(existing.map((f) => f.fileName));
    const newOnes: DrawFile[] = [];

    for (const f of files) {
      if (existingNames.has(f.name)) continue;
      const realFile = (f as { file?: File }).file;
      if (realFile) {
        const result = await uploadFile(realFile);
        if (result) {
          newOnes.push(result);
          continue;
        }
      }
      // 兜底：Mock 模式或上传失败时使用本地预览 URL
      newOnes.push({
        fileName: f.name,
        fileUrl: f.previewUrl || '',
        fileSize: f.size || 0,
        uploadTime: new Date().toISOString().split('T')[0],
      });
    }

    setUploadedFiles([...existing, ...newOnes]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addProject({
        name: formData.name,
        location: formData.location,
        type: formData.type,
        area: parseFloat(formData.area) || 0,
        estimatedCost: (parseFloat(formData.area) || 0) * 236,
        dealerId: user?.id || '',
        description: formData.description,
        drawFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
      setShowForm(false);
      setFormData({ name: '', location: '', type: '', area: '', description: '' });
      setUploadedFiles([]);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return PROJECT_STATUSES.find((s) => s.value === status) || { label: status, color: 'warn' as const };
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-steel-light pb-20">
        <Header title="新增项目报备" showBack onBack={() => setShowForm(false)} />
        <div className="px-4 py-4">
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">
                  项目名称 <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入项目名称"
                  className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">
                  项目地点 <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="请输入项目地点"
                  className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">
                  项目类型 <span className="text-status-danger">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                  required
                >
                  <option value="">请选择项目类型</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">
                  预计面积（㎡） <span className="text-status-danger">*</span>
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="请输入预计面积"
                  className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">项目描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请描述项目情况"
                  rows={3}
                  className="w-full px-3 py-2 border border-steel-light-gray rounded-base focus:outline-none focus:ring-2 focus:ring-rock-blue text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-gray mb-1">项目图纸</label>
                <FileUpload
                  value={uploadedFiles.map((f, i) => ({ uid: `${i}`, file: null as any, name: f.fileName, size: f.fileSize, type: '', previewUrl: f.fileUrl }))}
                  onChange={handleFileChange}
                  accept={['jpg', 'jpeg', 'png', 'pdf', 'dwg', 'dxf']}
                  maxCount={10}
                  maxSizeMB={20}
                  hint="支持图片、PDF、CAD图纸，单文件≤20MB，最多10个"
                />
              </div>
              <Button type="submit" size="lg" loading={submitting} className="w-full">提交报备</Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="项目报备" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setShowForm(true)} className="flex-1">
            <Plus size={18} className="mr-2" />
            新增项目报备
          </Button>
          {canExport && projects.length > 0 && (
            <Button variant="default" onClick={handleExport}>
              <Download size={16} className="mr-1" />
              导出
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {projects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-carbon-black">{project.name}</h3>
                  <StatusBadge status={statusInfo.label} color={statusInfo.color as 'success' | 'warn' | 'danger'} />
                </div>
                <div className="flex items-center gap-4 text-sm text-steel-light-gray mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {project.location}
                  </span>
                  <span>{project.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span>面积：{project.area}㎡</span>
                    <span className="text-rock-blue">预估：¥{(project.estimatedCost / 10000).toFixed(2)}万</span>
                  </div>
                  <span className="flex items-center gap-1 text-steel-light-gray">
                    <Calendar size={12} />
                    最后更新：{project.lastUpdate}
                  </span>
                </div>
                {project.description && (
                  <div className="mt-3 pt-3 border-t border-steel-light-gray">
                    <p className="text-sm text-steel-gray flex items-start gap-2">
                      <FileText size={14} className="flex-shrink-0 mt-0.5" />
                      {project.description}
                    </p>
                  </div>
                )}
                {project.drawFiles && project.drawFiles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-steel-light-gray">
                    <div className="flex items-center gap-2 mb-2">
                      <FileImage size={14} className="text-rock-blue" />
                      <span className="text-xs font-medium text-steel-gray">项目图纸</span>
                      <span className="text-xs text-steel-light-gray">({project.drawFiles.length}个文件)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.drawFiles.map((file, index) => (
                        <span key={index} className="text-xs text-steel-light-gray bg-steel-light px-2 py-1 rounded-base">
                          {file.fileName}
                        </span>
                      ))}
                    </div>
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
