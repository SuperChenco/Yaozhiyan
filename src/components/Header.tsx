import { ArrowLeft, Menu, Search, Bell } from 'lucide-react';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  /** 是否显示消息铃铛，默认 true */
  showNotify?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
  /** 自定义铃铛点击行为，默认调用 store.toggleNotify() */
  onNotify?: () => void;
}

/**
 * 全局头部组件
 *
 * 默认右上角显示消息铃铛 + 未读角标（自动从 store 读取），
 * 点击触发 store.toggleNotify()，App.tsx 全局挂载 MessageNotify 监听 store。
 * 业务页面无需任何改动即可拥有消息中心入口。
 */
export default function Header({
  title,
  showBack = false,
  showSearch = false,
  showMenu = false,
  showNotify = true,
  onBack,
  onSearch,
  onMenu,
  onNotify,
}: HeaderProps) {
  const unreadCount = useStore((state) => state.unreadCount);
  const toggleNotify = useStore((state) => state.toggleNotify);

  // 图标按钮统一覆盖样式：透明背景、无边框无阴影、白色文字
  const iconBtnClass =
    '!p-1 !bg-transparent !border-0 !shadow-none !text-steel-white hover:!text-steel-white hover:!border-0';

  const handleNotify = () => {
    if (onNotify) {
      onNotify();
    } else {
      toggleNotify();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-steel-dark text-steel-white border-b border-steel-dark">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="default" onClick={onBack} className={iconBtnClass}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-steel-white">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {showSearch && (
            <Button variant="default" onClick={onSearch} className={iconBtnClass}>
              <Search size={20} />
            </Button>
          )}
          {showMenu && (
            <Button variant="default" onClick={onMenu} className={iconBtnClass}>
              <Menu size={20} />
            </Button>
          )}
          {showNotify && (
            <Button
              variant="default"
              onClick={handleNotify}
              className={`!relative ${iconBtnClass}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-base bg-status-danger text-steel-white text-[10px] leading-4 font-medium text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
