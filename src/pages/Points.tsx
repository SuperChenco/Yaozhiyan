import { useState } from 'react';
import { TrendingUp, TrendingDown, Gift, FileText, ShoppingCart, Settings, Coins, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import type { PointRecordType } from '@/types';
import { POINT_RULES } from '@/constants';

interface PointsProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const TYPE_CONFIG: Record<PointRecordType, { label: string; icon: any; color: string; bg: string }> = {
  upload_case: { label: '案例上传奖励', icon: Gift, color: 'text-green-600', bg: 'bg-green-50' },
  project_report: { label: '项目报备奖励', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  order: { label: '订单消费奖励', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
  redeem: { label: '积分兑换', icon: Gift, color: 'text-red-600', bg: 'bg-red-50' },
  admin_adjust: { label: '管理员调整', icon: Settings, color: 'text-yellow-600', bg: 'bg-yellow-50' },
};

export default function Points({ onBack, onNavigate }: PointsProps) {
  const user = useStore((state) => state.user);
  const getPointRecords = useStore((state) => state.getPointRecords);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');

  const records = getPointRecords();

  const filteredRecords = records.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'income') return r.amount > 0;
    if (activeTab === 'expense') return r.amount < 0;
    return true;
  });

  const totalIncome = records.filter((r) => r.amount > 0).reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = Math.abs(records.filter((r) => r.amount < 0).reduce((sum, r) => sum + r.amount, 0));

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="我的积分" showBack onBack={onBack} />

      <div className="bg-gradient-to-br from-yaozhiyan-primary via-yaozhiyan-primaryLight to-yaozhiyan-secondary pt-6 pb-10 px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins size={24} className="text-yellow-300" />
            <span className="text-white/80 text-sm">当前积分</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-white">{user?.points?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="flex justify-around mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalIncome.toLocaleString()}</p>
            <div className="flex items-center gap-1 justify-center mt-1">
              <TrendingUp size={14} className="text-green-300" />
              <span className="text-white/70 text-xs">累计获得</span>
            </div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalExpense.toLocaleString()}</p>
            <div className="flex items-center gap-1 justify-center mt-1">
              <TrendingDown size={14} className="text-red-300" />
              <span className="text-white/70 text-xs">累计使用</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700 mb-3">获取积分</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-yaozhiyan-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift size={18} className="text-green-600" />
              </div>
              <p className="text-sm font-medium text-yaozhiyan-gray-800">上传案例</p>
              <p className="text-xs text-green-600 mt-1">+{POINT_RULES.upload_case_approved}</p>
            </div>
            <div className="text-center p-3 bg-yaozhiyan-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText size={18} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium text-yaozhiyan-gray-800">项目报备</p>
              <p className="text-xs text-blue-600 mt-1">+{POINT_RULES.project_report}</p>
            </div>
            <div className="text-center p-3 bg-yaozhiyan-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingCart size={18} className="text-purple-600" />
              </div>
              <p className="text-sm font-medium text-yaozhiyan-gray-800">订单消费</p>
              <p className="text-xs text-purple-600 mt-1">每千元+{POINT_RULES.order_per_1000}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-yaozhiyan-gray-700">积分明细</h3>
          <div className="flex gap-1">
            {[
              { key: 'all', label: '全部' },
              { key: 'income', label: '收入' },
              { key: 'expense', label: '支出' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  activeTab === tab.key
                    ? 'bg-yaozhiyan-primary text-white'
                    : 'text-yaozhiyan-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredRecords.map((record) => {
            const config = TYPE_CONFIG[record.type];
            const Icon = config.icon;
            const isIncome = record.amount > 0;

            return (
              <div
                key={record.id}
                className="bg-white rounded-xl p-3 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                  <Icon size={18} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yaozhiyan-gray-800">{config.label}</p>
                  <p className="text-xs text-yaozhiyan-gray-400 mt-0.5">{record.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : ''}{record.amount}
                  </p>
                  <p className="text-xs text-yaozhiyan-gray-400 mt-0.5">{record.createdAt}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-yaozhiyan-gray-400">
            <Coins size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无积分记录</p>
          </div>
        )}
      </div>

      {onNavigate && (
        <div className="px-4 mt-4">
          <Card className="p-4" onClick={() => onNavigate('case-upload')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yaozhiyan-gray-800">赚积分</p>
                  <p className="text-xs text-yaozhiyan-gray-400">上传项目案例赚积分</p>
                </div>
              </div>
              <p className="text-sm text-yaozhiyan-primary">去上传 &rarr;</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
