import { useState, useMemo } from 'react';
import { Bell, X, CheckCheck, FileText, ShoppingBag, FolderOpen, Gift } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import type { SystemMessage, SystemMessageType } from '@/types';

interface MessageNotifyProps {
  /** 控制弹窗显隐 */
  open: boolean;
  /** 关闭弹窗 */
  onClose: () => void;
  /** 点击单条消息跳转业务页面 */
  onJump: (page: string) => void;
}

/** 消息类型配置：图标 / 标签 / 颜色 */
function getTypeConfig(type: SystemMessageType): {
  icon: typeof FileText;
  label: string;
  color: 'success' | 'warn' | 'danger';
} {
  switch (type) {
    case 'audit':
      return { icon: CheckCheck, label: '审核通知', color: 'warn' };
    case 'order':
      return { icon: ShoppingBag, label: '订单通知', color: 'warn' };
    case 'project':
      return { icon: FolderOpen, label: '项目通知', color: 'success' };
    case 'exchange':
      return { icon: Gift, label: '兑换通知', color: 'danger' };
    default:
      return { icon: FileText, label: '系统', color: 'warn' };
  }
}

function formatTime(createTime: string): string {
  const date = new Date(createTime);
  const now = Date.now();
  const diff = now - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}-${d < 10 ? '0' + d : d}`;
}

export default function MessageNotify({ open, onClose, onJump }: MessageNotifyProps) {
  const messages = useStore((state) => state.messages);
  const markMessageRead = useStore((state) => state.markMessageRead);
  const markAllRead = useStore((state) => state.markAllRead);
  const [activeType, setActiveType] = useState<SystemMessageType | 'all'>('all');

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const filteredMessages = useMemo(() => {
    const list = activeType === 'all' ? messages : messages.filter((m) => m.type === activeType);
    return [...list].sort(
      (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
  }, [messages, activeType]);

  const handleItemClick = async (msg: SystemMessage) => {
    if (!msg.read) {
      await markMessageRead(msg.id);
    }
    if (msg.jumpPage) {
      onJump(msg.jumpPage);
    }
    onClose();
  };

  const handleMarkAll = async () => {
    await markAllRead();
  };

  if (!open) return null;

  const typeTabs: Array<{ key: SystemMessageType | 'all'; label: string }> = [
    { key: 'all', label: '全部' },
    { key: 'audit', label: '审核' },
    { key: 'order', label: '订单' },
    { key: 'project', label: '项目' },
    { key: 'exchange', label: '兑换' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end" onClick={onClose}>
      <div
        className="w-full bg-steel-white rounded-t-base max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题 */}
        <div className="flex items-center justify-between p-4 border-b border-steel-light-gray">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-rock-blue" />
            <h3 className="text-base font-medium text-carbon-black">消息通知</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-base bg-status-danger text-steel-white text-[10px] font-medium">
                {unreadCount} 条未读
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleMarkAll}
                className="!bg-transparent !border-0 !shadow-none !p-0 !text-rock-blue hover:!text-rock-blue hover:!border-0"
              >
                全部已读
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-steel-light-gray hover:!text-steel-gray hover:!border-0"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* 类型筛选 */}
        <div className="flex gap-2 px-4 py-2 border-b border-steel-light-gray overflow-x-auto">
          {typeTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeType === tab.key ? 'primary' : 'default'}
              size="sm"
              onClick={() => setActiveType(tab.key)}
              className="!flex-shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-steel-light-gray">
              <Bell size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无消息</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMessages.map((msg) => {
                const cfg = getTypeConfig(msg.type);
                const Icon = cfg.icon;
                return (
                  <Card
                    key={msg.id}
                    variant="light"
                    className="p-3 cursor-pointer hover:border-rock-blue"
                    onClick={() => handleItemClick(msg)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-base flex items-center justify-center flex-shrink-0 ${
                        msg.read ? 'bg-steel-light' : 'bg-rock-blue/10'
                      }`}>
                        <Icon size={16} className={msg.read ? 'text-steel-light-gray' : 'text-rock-blue'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`text-sm truncate ${msg.read ? 'font-normal text-steel-gray' : 'font-medium text-carbon-black'}`}>
                            {msg.title}
                          </h4>
                          {!msg.read && (
                            <span className="w-1.5 h-1.5 rounded-base bg-status-danger flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-steel-light-gray line-clamp-2 mb-2">{msg.content}</p>
                        <div className="flex items-center justify-between">
                          <StatusBadge label={cfg.label} color={cfg.color} />
                          <span className="text-xs text-steel-light-gray">{formatTime(msg.createTime)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
