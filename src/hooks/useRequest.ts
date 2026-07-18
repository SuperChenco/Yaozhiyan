import { useState, useCallback, useRef } from 'react';
import { ApiError } from '@/api/request';

interface UseRequestOptions<T> {
  manual?: boolean;
  defaultLoading?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  mockData?: T;
  /** 是否静默错误（不写入 globalError / 不触发登出），默认 false */
  silent?: boolean;
}

interface UseRequestResult<T, P extends any[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  run: (...args: P) => Promise<T | null>;
  setData: (data: T | null) => void;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const pendingRequests = new Map<string, Promise<any>>();

/**
 * 统一处理 ApiError：
 * - 401 未登录/token 过期：清除本地存储并触发登出，App.tsx 自动跳转登录页
 * - 403 无权限：写入 globalError 提示
 * - 5xx 服务异常：写入 globalError 提示
 * - 其他：写入 globalError 提示
 */
async function handleApiError(error: ApiError, silent: boolean): Promise<void> {
  if (silent) return;

  // 懒加载避免循环依赖
  const { useStore } = await import('@/store/useStore');
  const store = useStore.getState();

  if (error.code === 401) {
    // token 过期：清除本地存储并登出，App.tsx 会自动渲染 Login
    try {
      await store.logout();
    } catch {
      // ignore
    }
    store.clearError();
    return;
  }

  // 403/5xx/其他业务错误：写入 globalError，由 App.tsx 渲染 toast
  useStore.setState({ globalError: error.message });
}

export function useRequest<T, P extends any[] = any[]>(
  requestFn: (...args: P) => Promise<T>,
  options?: UseRequestOptions<T>
): UseRequestResult<T, P> {
  const { manual = false, defaultLoading = false, onSuccess, onError, mockData, silent = false } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!manual && defaultLoading);
  const [error, setError] = useState<Error | null>(null);
  const requestKeyRef = useRef<string>('');

  const run = useCallback(
    async (...args: P): Promise<T | null> => {
      const reqKey = JSON.stringify(args);

      if (pendingRequests.has(reqKey)) {
        return pendingRequests.get(reqKey) as Promise<T | null>;
      }

      setLoading(true);
      setError(null);

      const requestPromise = (async () => {
        try {
          let result: T;

          if (USE_MOCK && mockData !== undefined) {
            result = mockData;
          } else {
            result = await requestFn(...args);
          }

          setData(result);
          onSuccess?.(result);
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
          console.error('[useRequest error]', error);

          // 统一处理 ApiError：401 登出 / 403,5xx 写 globalError
          if (error instanceof ApiError) {
            await handleApiError(error, silent);
          } else if (!silent) {
            // 网络错误等其他异常
            const { useStore } = await import('@/store/useStore');
            useStore.setState({ globalError: error.message });
          }
          return null;
        } finally {
          setLoading(false);
          pendingRequests.delete(reqKey);
        }
      })();

      pendingRequests.set(reqKey, requestPromise);
      return requestPromise;
    },
    [requestFn, onSuccess, onError, mockData, silent]
  );

  return {
    data,
    loading,
    error,
    run,
    setData,
  };
}
