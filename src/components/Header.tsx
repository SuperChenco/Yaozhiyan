import { ArrowLeft, Menu, Search } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-yaozhiyan-gray-200">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={onBack} className="p-1 -ml-1">
              <ArrowLeft size={20} className="text-yaozhiyan-gray-700" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-yaozhiyan-gray-800">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {showSearch && (
            <button onClick={onSearch} className="p-1">
              <Search size={20} className="text-yaozhiyan-gray-600" />
            </button>
          )}
          {showMenu && (
            <button onClick={onMenu} className="p-1">
              <Menu size={20} className="text-yaozhiyan-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}