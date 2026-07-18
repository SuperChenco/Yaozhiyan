import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface ServerErrorProps {
  error?: string;
  onBack?: () => void;
  onRetry?: () => void;
}

export default function ServerError({ error, onBack, onRetry }: ServerErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-steel-light flex items-center justify-center px-4">
      <Card variant="light" className="w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 bg-status-warn/15 rounded-base flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-status-warn" />
        </div>
        <div className="text-5xl font-bold text-status-danger mb-2">500</div>
        <h2 className="text-lg font-medium text-carbon-black mb-2">服务器开小差了</h2>
        <p className="text-sm text-steel-light-gray mb-4">
          页面加载出现异常，请稍后再试
        </p>
        {error && (
          <div className="bg-steel-light rounded-base p-3 mb-4 text-left">
            <p className="text-xs text-steel-gray font-mono break-all">{error}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="default" fullWidth onClick={onBack}>
            <Home size={16} className="mr-2" />
            返回首页
          </Button>
          <Button variant="primary" fullWidth onClick={handleRetry}>
            <RefreshCcw size={16} className="mr-2" />
            重新尝试
          </Button>
        </div>
      </Card>
    </div>
  );
}
