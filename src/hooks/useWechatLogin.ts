import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { wechatApi } from '@/api/wechat';
import { isUseMock } from '@/api/request';

interface UseWechatLoginResult {
  /** 跳转微信授权页 */
  redirectToWechat: () => void;
  /** 用 code 完成登录 */
  loginByCode: (code: string, phone?: string) => Promise<boolean>;
  /** 当前是否在微信浏览器中 */
  isInWechat: boolean;
}

/**
 * 微信公众号 H5 OAuth2 登录 Hook
 *
 * 流程：
 * 1. redirectToWechat() 跳转微信授权页
 * 2. 用户授权后微信回调当前页面并附带 ?code=xxx&state=xxx
 * 3. App 启动时检测 URL 中的 code，调用 loginByCode(code) 完成登录
 *
 * Mock 模式：跳过跳转，直接用 code=mock_code 登录
 */
export function useWechatLogin(): UseWechatLoginResult {
  const wechatLogin = useStore((state) => state.wechatLogin);

  const isInWechat = typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

  const redirectToWechat = useCallback(() => {
    if (isUseMock()) {
      // Mock 模式：直接用 mock code 完成登录
      wechatLogin('mock_code').catch(() => {
        // 失败兜底由 Login.tsx 弹 toast
      });
      return;
    }
    const redirectUri = window.location.origin + window.location.pathname;
    const url = wechatApi.buildAuthorizeUrl(redirectUri);
    window.location.href = url;
  }, [wechatLogin]);

  const loginByCode = useCallback(
    async (code: string, phone?: string): Promise<boolean> => {
      return wechatLogin(code, phone);
    },
    [wechatLogin]
  );

  return { redirectToWechat, loginByCode, isInWechat };
}

/**
 * 从 URL 解析微信回调 code（用于 App 启动时自动登录）
 * 返回 null 表示当前不是微信回调
 */
export function parseWechatCodeFromUrl(): { code: string; state: string } | null {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code) return null;
  return { code, state: state || '' };
}

/**
 * 清除 URL 上的 code/state 参数（避免刷新重复登录）
 */
export function clearWechatCodeFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, document.title, url.toString());
}
