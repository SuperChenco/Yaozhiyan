import { useState } from 'react';
import { Eye, EyeOff, User, Lock, MessageCircle } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStore } from '@/store/useStore';
import { useWechatLogin } from '@/hooks/useWechatLogin';

interface LoginProps {
  onRegister: () => void;
  onSuccess: () => void;
}

export default function Login({ onRegister, onSuccess }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [wechatLoading, setWechatLoading] = useState(false);
  const login = useStore((state) => state.login);
  const { redirectToWechat } = useWechatLogin();

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

  const handleWechatLogin = async () => {
    setError('');
    setWechatLoading(true);
    try {
      // Mock 模式：redirectToWechat 内部直接触发登录
      // 真实环境：跳转微信授权页，回调时 App 自动用 code 登录
      const success = await new Promise<boolean>((resolve) => {
        redirectToWechat();
        // Mock 模式下 wechatLogin 是同步触发，等待 500ms 后检测登录状态
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
      if (success) {
        onSuccess();
      }
    } catch {
      setError('微信授权失败，请使用手机号登录');
    } finally {
      setWechatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steel-dark flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-rock-blue/10 rounded-base flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-rock-blue">曜</span>
          </div>
          <h1 className="text-xl font-bold text-carbon-black">经销商登录</h1>
          <p className="text-sm text-steel-light-gray mt-1">欢迎加入曜之岩经销商体系</p>
        </div>

        {/* 微信一键登录 - 主入口 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={wechatLoading}
          onClick={handleWechatLogin}
          className="mb-4"
        >
          <MessageCircle size={18} className="mr-2" />
          微信一键登录
        </Button>

        {/* 分隔线 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-steel-light-gray" />
          <span className="text-xs text-steel-light-gray">其他登录方式</span>
          <div className="flex-1 h-px bg-steel-light-gray" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-steel-gray mb-1">手机号</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-3 py-2.5 border border-steel-light-gray rounded-base focus:outline-none focus:border-rock-blue text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-gray mb-1">密码</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-light-gray" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-10 py-2.5 border border-steel-light-gray rounded-base focus:outline-none focus:border-rock-blue text-sm"
              />
              <Button
                variant="default"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="!absolute !right-3 !top-1/2 -translate-y-1/2 !p-0 !bg-transparent !border-0 !shadow-none hover:!border-0"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-steel-light-gray" />
                ) : (
                  <Eye size={18} className="text-steel-light-gray" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-status-danger text-center">{error}</p>
          )}

          <Button onClick={handleLogin} size="lg" className="w-full">
            登录
          </Button>

          <div className="text-center">
            <Button
              variant="default"
              onClick={onRegister}
              className="!bg-transparent !border-0 !shadow-none !p-0 !text-rock-blue hover:!text-rock-blue hover:!border-0"
            >
              还没有账号？立即注册
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-steel-light-gray">
              测试账号：13800138001 密码：123456
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
