import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { UserRole } from '@/types';

interface UseAuthResult {
  hasPermission: boolean;
  isAdmin: boolean;
  isProvincial: boolean;
  isCity: boolean;
  userRole: UserRole | null;
  /** 按钮级权限校验：返回当前用户是否属于允许的角色 */
  requireAuth: (allowedRoles: UserRole[]) => boolean;
  /** 页面级权限守卫：返回 'login' | '404' | null(null=放行) */
  requirePageAuth: (allowedRoles: UserRole[]) => 'login' | '404' | null;
}

export function useAuth(requiredRoles?: UserRole[]): UseAuthResult {
  const user = useStore((state) => state.user);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const isAdmin = user?.role === 'admin';
  const isProvincial = user?.role === 'provincial';
  const isCity = user?.role === 'city';

  const hasPermission = useMemo(() => {
    if (!isLoggedIn || !user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  }, [isLoggedIn, user, requiredRoles]);

  const requireAuth = (allowedRoles: UserRole[]): boolean => {
    if (!isLoggedIn || !user) return false;
    return allowedRoles.includes(user.role);
  };

  // 页面级守卫：未登录跳登录页；已登录但无权限跳 404
  const requirePageAuth = (allowedRoles: UserRole[]): 'login' | '404' | null => {
    if (!isLoggedIn || !user) return 'login';
    if (!allowedRoles || allowedRoles.length === 0) return null;
    if (!allowedRoles.includes(user.role)) return '404';
    return null;
  };

  return {
    hasPermission,
    isAdmin,
    isProvincial,
    isCity,
    userRole: user?.role || null,
    requireAuth,
    requirePageAuth,
  };
}
