import type { ApiResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const TOKEN_KEY = 'yzy_token';
const USER_KEY = 'yzy_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setStoredUser(user: unknown): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export function isUseMock(): boolean {
  return USE_MOCK;
}

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, signal } = options;

  const token = getToken();
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    throw new ApiError(-1, err instanceof Error ? err.message : '网络请求失败');
  }

  if (response.status === 401) {
    removeToken();
    // 懒加载避免循环依赖：触发 store 重置，App.tsx 会自动跳转登录页
    try {
      const { useStore } = await import('@/store/useStore');
      useStore.setState({
        user: null,
        isLoggedIn: false,
        token: null,
        initialized: true,
      });
    } catch {
      // ignore
    }
    throw new ApiError(401, '登录已过期，请重新登录');
  }

  if (response.status === 403) {
    throw new ApiError(403, '暂无权限执行此操作');
  }

  if (response.status >= 500) {
    throw new ApiError(response.status, '服务器异常，请稍后重试');
  }

  let json: ApiResponse<T>;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(-2, '响应解析失败');
  }

  if (json.code !== 0 && json.code !== 200) {
    throw new ApiError(json.code, json.message || '请求失败');
  }

  return json.data;
}

export function buildQuery(params: Record<string, unknown>): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `?${query}` : '';
}
