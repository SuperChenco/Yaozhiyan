import { useState } from 'react';
import { Users, Search, Check, X, Building, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import { DEALER_LEVELS } from '@/constants';

interface DealerManagementProps {
  onBack: () => void;
}

export default function DealerManagement({ onBack }: DealerManagementProps) {
  const dealerList = useStore((state) => state.dealerList);
  const approveDealer = useStore((state) => state.approveDealer);
  const rejectDealer = useStore((state) => state.rejectDealer);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredDealers = dealerList.filter((d) => {
    if (activeTab === 'all') return true;
    return d.status === activeTab;
  });

  const getStatusLabel = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: '待审核', color: 'bg-amber-100 text-amber-600' },
      approved: { label: '已通过', color: 'bg-green-100 text-green-600' },
      rejected: { label: '已拒绝', color: 'bg-red-100 text-red-600' },
    };
    return map[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
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
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="经销商管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="flex bg-yaozhiyan-gray-100 rounded-lg p-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-yaozhiyan-primary shadow-sm'
                  : 'text-yaozhiyan-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredDealers.map((dealer) => {
            const statusInfo = getStatusLabel(dealer.status);
            return (
              <Card key={dealer.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yaozhiyan-primary/10 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-yaozhiyan-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yaozhiyan-gray-800">{dealer.name}</h4>
                      <p className="text-xs text-yaozhiyan-gray-500 mt-0.5">{dealer.company}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-yaozhiyan-gray-500">
                    <Building size={12} />
                    <span>{getLevelLabel(dealer.level)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-yaozhiyan-gray-500">
                    <MapPin size={12} />
                    <span>
                      {dealer.province}
                      {dealer.city && ` · ${dealer.city}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-yaozhiyan-gray-400 mb-3">
                  <Phone size={12} />
                  <span>{dealer.phone}</span>
                </div>

                {dealer.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-yaozhiyan-gray-100">
                    <button
                      onClick={() => approveDealer(dealer.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm"
                    >
                      <Check size={16} />
                      通过
                    </button>
                    <button
                      onClick={() => rejectDealer(dealer.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-500 rounded-lg text-sm"
                    >
                      <X size={16} />
                      拒绝
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filteredDealers.length === 0 && (
          <div className="text-center py-12 text-yaozhiyan-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无经销商数据</p>
          </div>
        )}
      </div>
    </div>
  );
}