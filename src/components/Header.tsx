import { ArrowLeft, Menu, Search } from 'lucide-react';
import Button from '@/components/Button';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onMenu?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showSearch = false,
  showMenu = false,
  onBack,
  onSearch,
  onMenu,
}: HeaderProps) {
  // 图标按钮统一覆盖样式：透明背景、无边框无阴影、白色文字
  const iconBtnClass =
    '!p-1 !bg-transparent !border-0 !shadow-none !text-steel-white hover:!text-steel-white hover:!border-0';

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
        </div>
      </div>
    </header>
  );
}
