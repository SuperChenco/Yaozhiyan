import { request, isUseMock } from './request';
import { setToken, setStoredUser } from './request';
import type { LoginResult, User } from './types';

const USE_MOCK = isUseMock();

/** 微信 OAuth2 授权返回信息 */
export interface WechatAuthInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  unionid?: string;
}

/** 微信登录后端入参 */
export interface WechatLoginParams {
  code: string;
  /** 已绑定手机号时附带，用于跨账号关联 */
  phone?: string;
}

/**
 * 微信公众号 H5 OAuth2 流程：
 * 1. 前端引导跳转 https://open.weixin.qq.com/connect/oauth2/authorize?appid=...&redirect_uri=...&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
 * 2. 用户授权后微信回调 redirect_uri?code=xxx&state=xxx
 * 3. 前端取 code 调后端 /auth/wechat/login 完成登录
 */
export const wechatApi = {
  /**
   * 构造微信授权跳转 URL
   * @param redirectUri 授权后回调地址（需与公众号配置一致，需 urlencode）
   * @param state 防 CSRF，可选
   * @param scope snsapi_base 静默授权 / snsapi_userinfo 弹窗授权
   */
  buildAuthorizeUrl(redirectUri: string, state = 'yzy', scope: 'snsapi_base' | 'snsapi_userinfo' = 'snsapi_userinfo'): string {
    const appid = import.meta.env.VITE_WECHAT_APPID || '';
    const redirect = encodeURIComponent(redirectUri);
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  },

  /** 用 code 换取后端 token + 用户信息 */
  async loginByCode(params: WechatLoginParams): Promise<LoginResult> {
    if (USE_MOCK) {
      return mockWechatLogin(params);
    }
    return request<LoginResult>('/auth/wechat/login', { method: 'POST', body: params });
  },

  /** 拉取微信用户信息（snsapi_userinfo 模式后端代理调用） */
  async getUserInfo(openid: string): Promise<WechatAuthInfo> {
    if (USE_MOCK) {
      return {
        openid,
        nickname: '微信用户',
        headimgurl: '',
      };
    }
    return request<WechatAuthInfo>(`/auth/wechat/userinfo?openid=${encodeURIComponent(openid)}`);
  },

  /** 已登录用户绑定微信 openid */
  async bind(openid: string): Promise<User> {
    if (USE_MOCK) {
      return mockWechatBind(openid);
    }
    return request<User>('/auth/wechat/bind', { method: 'POST', body: { openid } });
  },
};

// ===== Mock 实现 =====

import { adminUser } from '@/api/mockFallback';

async function mockWechatLogin(params: WechatLoginParams): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 300));
  // Mock 模式：直接以 admin 身份登录
  const user: User = {
    ...adminUser,
    openid: `mock_openid_${params.code}`,
    wechatName: '微信用户',
    wechatAvatar: '',
  };
  const token = `mock-wechat-token-${params.code}`;
  setToken(token);
  setStoredUser(user);
  return { token, user };
}

async function mockWechatBind(openid: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    ...adminUser,
    openid,
    wechatName: '微信用户',
    wechatAvatar: '',
  };
}
