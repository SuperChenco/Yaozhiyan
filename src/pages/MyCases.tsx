import { useState } from 'react';
import { Image, Clock, CheckCircle, XCircle, MapPin, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import type { ProjectCase, CaseStatus } from '@/types';

interface MyCasesProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

// 案例状态到StatusBadge颜色映射
const STATUS_MAP: Record<CaseStatus, { label: string; color: 'success' | 'warn' | 'danger' }> = {
  pending: { label: '审核中', color: 'warn' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已拒绝', color: 'danger' },
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
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="我的案例" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'default'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {onNavigate && (
          <Card className="p-4 mb-4" onClick={() => onNavigate('case-upload')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rock-blue/10 rounded-base flex items-center justify-center">
                  <Image size={20} className="text-rock-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-carbon-black">上传新案例</p>
                  <p className="text-xs text-steel-light-gray">审核通过可获得积分奖励</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-steel-light-gray" />
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {filteredCases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-16 text-steel-light-gray">
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
          <img src={item.images[0]} alt="" className="w-20 h-20 rounded-base object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-carbon-black line-clamp-1">{item.name}</h3>
            <StatusBadge label={statusInfo.label} color={statusInfo.color} size="sm" />
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-steel-light-gray">
            <MapPin size={12} />
            <span>{item.location}</span>
            <span className="mx-1">·</span>
            <span>{item.area}㎡</span>
          </div>
          <p className="text-xs text-steel-light-gray mt-1 line-clamp-1">{item.productName}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-steel-light-gray">
            <Clock size={12} />
            <span>{item.createdAt}</span>
            {item.status === 'approved' && item.pointsAwarded && (
              <span className="ml-auto text-status-warn flex items-center gap-0.5">
                +{item.pointsAwarded} 积分
              </span>
            )}
          </div>
        </div>
      </div>
      {item.status === 'rejected' && item.rejectReason && (
        <div className="mt-3 p-2 bg-status-danger/15 rounded-base">
          <p className="text-xs text-status-danger">拒绝原因：{item.rejectReason}</p>
        </div>
      )}
    </Card>
  );
}
