import { Home, RefreshCcw } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface NotFoundProps {
  onBack?: () => void;
}

export default function NotFound({ onBack }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-steel-light flex items-center justify-center px-4">
      <Card variant="light" className="w-full max-w-sm p-6 text-center">
        <div className="text-6xl font-bold text-rock-blue mb-2">404</div>
        <h2 className="text-lg font-medium text-carbon-black mb-2">页面未找到</h2>
        <p className="text-sm text-steel-light-gray mb-6">
          您访问的页面不存在或已被移除
        </p>
        <div className="flex gap-3">
          <Button variant="default" fullWidth onClick={onBack}>
            <Home size={16} className="mr-2" />
            返回首页
          </Button>
          <Button variant="primary" fullWidth onClick={() => window.location.reload()}>
            <RefreshCcw size={16} className="mr-2" />
            重新加载
          </Button>
        </div>
      </Card>
    </div>
  );
}
