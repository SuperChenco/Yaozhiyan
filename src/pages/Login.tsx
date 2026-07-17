import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';

interface LoginProps {
  onRegister: () => void;
  onSuccess: () => void;
}

export default function Login({ onRegister, onSuccess }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useStore((state) => state.login);

  const handleLogin = async () => {
    setError('');
    if (!phone || !password) {
      setError('请填写完整信息');
      return;
    }
    const success = await login(phone, password);
    if (success) {
      onSuccess();
    } else {
      setError('手机号或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yaozhiyan-primary via-yaozhiyan-primaryLight to-yaozhiyan-secondary flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yaozhiyan-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-yaozhiyan-primary">曜</span>
          </div>
          <h1 className="text-xl font-bold text-yaozhiyan-gray-800">经销商登录</h1>
          <p className="text-sm text-yaozhiyan-gray-500 mt-1">欢迎加入曜之岩经销商体系</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">手机号</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-3 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yaozhiyan-gray-700 mb-1">密码</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-yaozhiyan-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-10 py-2.5 border border-yaozhiyan-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yaozhiyan-primary text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-yaozhiyan-gray-400" />
                ) : (
                  <Eye size={18} className="text-yaozhiyan-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button onClick={handleLogin} size="lg" className="w-full">
            登录
          </Button>

          <div className="text-center">
            <button
              onClick={onRegister}
              className="text-sm text-yaozhiyan-primary hover:underline"
            >
              还没有账号？立即注册
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-yaozhiyan-gray-400">
              测试账号：13800138001 密码：123456
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}