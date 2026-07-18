import { useState } from 'react';
import { Image as ImageIcon, MapPin, Clock, Check, X, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import type { ProjectCase, CaseStatus } from '@/types';
import { POINT_RULES } from '@/constants';

interface CaseReviewProps {
  onBack: () => void;
}

// 案例状态到StatusBadge颜色映射
const CASE_STATUS_CONFIG: Record<CaseStatus, { label: string; color: 'success' | 'warn' | 'danger' }> = {
  pending: { label: '待审核', color: 'warn' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已拒绝', color: 'danger' },
};

export default function CaseReview({ onBack }: CaseReviewProps) {
  const pendingCases = useStore((state) => state.pendingCases);
  const myCases = useStore((state) => state.myCases);
  const approveCase = useStore((state) => state.approveCase);
  const rejectCase = useStore((state) => state.rejectCase);

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [selectedCase, setSelectedCase] = useState<ProjectCase | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const allCases = [...new Map([...pendingCases, ...myCases].map(c => [c.id, c])).values()];
  const displayCases = activeTab === 'pending' ? pendingCases : allCases;

  const handleApprove = (caseId: string) => {
    approveCase(caseId);
    if (selectedCase?.id === caseId) {
      setSelectedCase(null);
    }
  };

  const handleReject = (caseId: string) => {
    if (!rejectReason.trim()) return;
    rejectCase(caseId, rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason('');
    if (selectedCase?.id === caseId) {
      setSelectedCase(null);
    }
  };

  if (selectedCase) {
    const statusConfig = CASE_STATUS_CONFIG[selectedCase.status];
    return (
      <div className="min-h-screen bg-steel-light">
        <Header title="案例详情" showBack onBack={() => setSelectedCase(null)} />
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {selectedCase.images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full aspect-square rounded-base object-cover" />
            ))}
          </div>

          <Card className="p-4 mb-4">
            <h2 className="text-lg font-bold text-carbon-black mb-3">{selectedCase.name}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-steel-gray">
                <MapPin size={16} />
                <span>{selectedCase.location}</span>
              </div>
              <div className="flex items-center gap-2 text-steel-gray">
                <ImageIcon size={16} />
                <span>{selectedCase.type}</span>
                <span className="mx-2">·</span>
                <span>{selectedCase.area} ㎡</span>
              </div>
              <div className="flex items-center gap-2 text-steel-gray">
                <Clock size={16} />
                <span>提交时间：{selectedCase.createdAt}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-2">经销商信息</h3>
            <div className="text-sm text-steel-gray">{selectedCase.dealerName}</div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-2">使用产品</h3>
            <p className="text-sm text-steel-gray">{selectedCase.productName}</p>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-steel-gray mb-2">项目描述</h3>
            <p className="text-sm text-steel-gray leading-relaxed">
              {selectedCase.description || '暂无描述'}
            </p>
          </Card>

          {selectedCase.status === 'pending' && (
            <div className="flex gap-3">
              <Button variant="danger" size="lg" fullWidth onClick={() => setShowRejectModal(true)}>
                <X size={18} />
                拒绝
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={() => handleApprove(selectedCase.id)}>
                <Check size={18} />
                通过
              </Button>
            </div>
          )}

          {selectedCase.status === 'approved' && (
            <div className="text-center py-4">
              <StatusBadge label="已通过" color="success" size="md" />
              {selectedCase.pointsAwarded && (
                <p className="text-xs text-status-warn mt-2">
                  已发放 +{selectedCase.pointsAwarded} 积分
                </p>
              )}
            </div>
          )}

          {selectedCase.status === 'rejected' && (
            <div className="text-center py-4">
              <StatusBadge label="已拒绝" color="danger" size="md" />
              {selectedCase.rejectReason && (
                <p className="text-xs text-steel-light-gray mt-2">
                  原因：{selectedCase.rejectReason}
                </p>
              )}
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-steel-white rounded-base w-full max-w-sm p-5">
              <h3 className="text-base font-medium text-carbon-black mb-3">拒绝原因</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入拒绝原因"
                rows={3}
                className="w-full px-3 py-2 border border-steel-light-gray rounded-base text-sm focus:outline-none focus:border-status-danger resize-none"
              />
              <div className="flex gap-3 mt-4">
                <Button variant="default" fullWidth onClick={() => setShowRejectModal(false)}>
                  取消
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  disabled={!rejectReason.trim()}
                  onClick={() => handleReject(selectedCase.id)}
                >
                  确认拒绝
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="案例审核" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'pending' ? 'primary' : 'default'}
            size="md"
            fullWidth
            onClick={() => setActiveTab('pending')}
          >
            待审核 ({pendingCases.length})
          </Button>
          <Button
            variant={activeTab === 'all' ? 'primary' : 'default'}
            size="md"
            fullWidth
            onClick={() => setActiveTab('all')}
          >
            全部案例 ({allCases.length})
          </Button>
        </div>

        <div className="space-y-3">
          {displayCases.map((item) => {
            const statusConfig = CASE_STATUS_CONFIG[item.status];
            return (
              <Card key={item.id} className="p-4" onClick={() => setSelectedCase(item)}>
                <div className="flex gap-3">
                  {item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-20 h-20 rounded-base object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-carbon-black line-clamp-1">
                        {item.name}
                      </h3>
                      <StatusBadge label={statusConfig.label} color={statusConfig.color} size="sm" />
                    </div>
                    <p className="text-xs text-steel-light-gray mt-1">{item.dealerName}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-steel-light-gray">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                      <span className="mx-1">·</span>
                      <span>{item.area}㎡</span>
                    </div>
                    <p className="text-xs text-steel-light-gray mt-1 line-clamp-1">
                      {item.productName}
                    </p>
                    {item.status === 'approved' && item.pointsAwarded && (
                      <p className="text-xs text-status-warn mt-1">已发 +{item.pointsAwarded} 积分</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {displayCases.length === 0 && (
          <div className="text-center py-16 text-steel-light-gray">
            <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无待审核案例</p>
          </div>
        )}
      </div>
    </div>
  );
}
