import { useState } from 'react';
import { Image as ImageIcon, MapPin, Clock, Check, X, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import type { ProjectCase } from '@/types';
import { POINT_RULES } from '@/constants';

interface CaseReviewProps {
  onBack: () => void;
}

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
    return (
      <div className="min-h-screen bg-yaozhiyan-gray-50">
        <Header title="案例详情" showBack onBack={() => setSelectedCase(null)} />
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {selectedCase.images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full aspect-square rounded-lg object-cover" />
            ))}
          </div>

          <Card className="p-4 mb-4">
            <h2 className="text-lg font-bold text-yaozhiyan-gray-800 mb-3">{selectedCase.name}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-yaozhiyan-gray-600">
                <MapPin size={16} />
                <span>{selectedCase.location}</span>
              </div>
              <div className="flex items-center gap-2 text-yaozhiyan-gray-600">
                <ImageIcon size={16} />
                <span>{selectedCase.type}</span>
                <span className="mx-2">·</span>
                <span>{selectedCase.area} ㎡</span>
              </div>
              <div className="flex items-center gap-2 text-yaozhiyan-gray-600">
                <Clock size={16} />
                <span>提交时间：{selectedCase.createdAt}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-2">经销商信息</h3>
            <div className="text-sm text-yaozhiyan-gray-600">{selectedCase.dealerName}</div>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-2">使用产品</h3>
            <p className="text-sm text-yaozhiyan-gray-600">{selectedCase.productName}</p>
          </Card>

          <Card className="p-4 mb-4">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-2">项目描述</h3>
            <p className="text-sm text-yaozhiyan-gray-600 leading-relaxed">
              {selectedCase.description || '暂无描述'}
            </p>
          </Card>

          {selectedCase.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(true);
                }}
                className="flex-1 py-3 border border-red-500 text-red-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <X size={18} />
                拒绝
              </button>
              <button
                onClick={() => handleApprove(selectedCase.id)}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Check size={18} />
                通过
              </button>
            </div>
          )}

          {selectedCase.status === 'approved' && (
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm">
                <Check size={16} />
                已通过
              </span>
              {selectedCase.pointsAwarded && (
                <p className="text-xs text-yellow-600 mt-2">
                  已发放 +{selectedCase.pointsAwarded} 积分
                </p>
              )}
            </div>
          )}

          {selectedCase.status === 'rejected' && (
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm">
                <X size={16} />
                已拒绝
              </span>
              {selectedCase.rejectReason && (
                <p className="text-xs text-yaozhiyan-gray-500 mt-2">
                  原因：{selectedCase.rejectReason}
                </p>
              )}
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-5">
              <h3 className="text-base font-medium text-yaozhiyan-gray-800 mb-3">拒绝原因</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入拒绝原因"
                rows={3}
                className="w-full px-3 py-2 border border-yaozhiyan-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 border border-yaozhiyan-gray-200 text-yaozhiyan-gray-600 rounded-lg text-sm"
                >
                  取消
                </button>
                <button
                  onClick={() => handleReject(selectedCase.id)}
                  disabled={!rejectReason.trim()}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  确认拒绝
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="案例审核" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-yaozhiyan-primary text-white'
                : 'bg-white text-yaozhiyan-gray-600 border border-yaozhiyan-gray-200'
            }`}
          >
            待审核 ({pendingCases.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-yaozhiyan-primary text-white'
                : 'bg-white text-yaozhiyan-gray-600 border border-yaozhiyan-gray-200'
            }`}
          >
            全部案例 ({allCases.length})
          </button>
        </div>

        <div className="space-y-3">
          {displayCases.map((item) => (
            <Card key={item.id} className="p-4" onClick={() => setSelectedCase(item)}>
              <div className="flex gap-3">
                {item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-yaozhiyan-gray-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs ${
                        item.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-600'
                          : item.status === 'approved'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已拒绝'}
                    </span>
                  </div>
                  <p className="text-xs text-yaozhiyan-gray-400 mt-1">{item.dealerName}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-yaozhiyan-gray-400">
                    <MapPin size={12} />
                    <span>{item.location}</span>
                    <span className="mx-1">·</span>
                    <span>{item.area}㎡</span>
                  </div>
                  <p className="text-xs text-yaozhiyan-gray-400 mt-1 line-clamp-1">
                    {item.productName}
                  </p>
                  {item.status === 'approved' && item.pointsAwarded && (
                    <p className="text-xs text-yellow-600 mt-1">已发 +{item.pointsAwarded} 积分</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {displayCases.length === 0 && (
          <div className="text-center py-16 text-yaozhiyan-gray-400">
            <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无待审核案例</p>
          </div>
        )}
      </div>
    </div>
  );
}
