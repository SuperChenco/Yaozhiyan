import { useState } from 'react';
import { Users, Search, Check, X, Building, MapPin, Phone, Download } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { exportDealers } from '@/utils';
import { DEALER_LEVELS } from '@/constants';

interface DealerManagementProps {
  onBack: () => void;
}

// 经销商状态到StatusBadge颜色映射
const DEALER_STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warn' | 'danger' }> = {
  pending: { label: '待审核', color: 'warn' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已拒绝', color: 'danger' },
};

export default function DealerManagement({ onBack }: DealerManagementProps) {
  const dealerList = useStore((state) => state.dealerList);
  const approveDealer = useStore((state) => state.approveDealer);
  const rejectDealer = useStore((state) => state.rejectDealer);
  const pointRecords = useStore((state) => state.pointRecords);
  const { isAdmin, isProvincial } = useAuth();
  const canExport = isAdmin || isProvincial;

  const handleExport = () => {
    const ok = exportDealers(dealerList, pointRecords, { filename: '经销商报表' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredDealers = dealerList.filter((d) => {
    if (activeTab === 'all') return true;
    return d.status === activeTab;
  });

  const getStatusInfo = (status: string) => {
    return DEALER_STATUS_CONFIG[status] || { label: status, color: 'warn' as const };
  };

  const getLevelLabel = (level: string) => {
    return DEALER_LEVELS.find((l) => l.value === level)?.label || level;
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已拒绝' },
  ];

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="经销商管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex bg-steel-light rounded-base p-1 flex-1">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'primary' : 'default'}
                size="sm"
                onClick={() => setActiveTab(tab.key as 'all' | 'pending' | 'approved' | 'rejected')}
                className="flex-1 !rounded-md"
              >
                {tab.label}
              </Button>
            ))}
          </div>
          {canExport && (
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download size={14} className="mr-1" />
              导出
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {filteredDealers.map((dealer) => {
            const statusInfo = getStatusInfo(dealer.status);
            return (
              <Card key={dealer.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rock-blue/10 rounded-base flex items-center justify-center">
                      <Users size={20} className="text-rock-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-carbon-black">{dealer.name}</h4>
                      <p className="text-xs text-steel-light-gray mt-0.5">{dealer.company}</p>
                    </div>
                  </div>
                  <StatusBadge label={statusInfo.label} color={statusInfo.color} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-steel-light-gray">
                    <Building size={12} />
                    <span>{getLevelLabel(dealer.level)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-steel-light-gray">
                    <MapPin size={12} />
                    <span>
                      {dealer.province}
                      {dealer.city && ` · ${dealer.city}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-steel-light-gray mb-3">
                  <Phone size={12} />
                  <span>{dealer.phone}</span>
                </div>

                {dealer.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-steel-light-gray">
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={() => approveDealer(dealer.id)}
                      className="!bg-status-success/15 !text-status-success !border-status-success/30 hover:!bg-status-success/15 hover:!text-status-success"
                    >
                      <Check size={16} />
                      通过
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={() => rejectDealer(dealer.id)}
                      className="!bg-status-danger/15 !text-status-danger !border-status-danger/30 hover:!bg-status-danger/15 hover:!text-status-danger"
                    >
                      <X size={16} />
                      拒绝
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filteredDealers.length === 0 && (
          <div className="text-center py-12 text-steel-light-gray">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无经销商数据</p>
          </div>
        )}
      </div>
    </div>
  );
}
