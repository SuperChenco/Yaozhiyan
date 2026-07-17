import { useState } from 'react';
import { Image, Clock, CheckCircle, XCircle, MapPin, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import type { ProjectCase, CaseStatus } from '@/types';

interface MyCasesProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const STATUS_MAP: Record<CaseStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '审核中', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  approved: { label: '已通过', color: 'text-green-600', bg: 'bg-green-50' },
  rejected: { label: '已拒绝', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function MyCases({ onBack, onNavigate }: MyCasesProps) {
  const getMyCases = useStore((state) => state.getMyCases);
  const [activeTab, setActiveTab] = useState<CaseStatus | 'all'>('all');

  const myCases = getMyCases();
  const filteredCases = activeTab === 'all' ? myCases : myCases.filter((c) => c.status === activeTab);

  const tabs: { key: CaseStatus | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '审核中' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已拒绝' },
  ];

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="我的案例" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-yaozhiyan-primary text-white'
                  : 'bg-white text-yaozhiyan-gray-600 border border-yaozhiyan-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {onNavigate && (
          <Card className="p-4 mb-4" onClick={() => onNavigate('case-upload')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yaozhiyan-primary/10 rounded-full flex items-center justify-center">
                  <Image size={20} className="text-yaozhiyan-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yaozhiyan-gray-800">上传新案例</p>
                  <p className="text-xs text-yaozhiyan-gray-400">审核通过可获得积分奖励</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-yaozhiyan-gray-400" />
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {filteredCases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-16 text-yaozhiyan-gray-400">
            <Image size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无案例</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CaseCard({ item }: { item: ProjectCase }) {
  const statusInfo = STATUS_MAP[item.status];

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        {item.images[0] && (
          <img src={item.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-yaozhiyan-gray-800 line-clamp-1">{item.name}</h3>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs ${statusInfo.color} ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-yaozhiyan-gray-400">
            <MapPin size={12} />
            <span>{item.location}</span>
            <span className="mx-1">·</span>
            <span>{item.area}㎡</span>
          </div>
          <p className="text-xs text-yaozhiyan-gray-400 mt-1 line-clamp-1">{item.productName}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-yaozhiyan-gray-400">
            <Clock size={12} />
            <span>{item.createdAt}</span>
            {item.status === 'approved' && item.pointsAwarded && (
              <span className="ml-auto text-yellow-600 flex items-center gap-0.5">
                +{item.pointsAwarded} 积分
              </span>
            )}
          </div>
        </div>
      </div>
      {item.status === 'rejected' && item.rejectReason && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg">
          <p className="text-xs text-red-600">拒绝原因：{item.rejectReason}</p>
        </div>
      )}
    </Card>
  );
}
