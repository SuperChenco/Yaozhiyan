import { ReactNode } from 'react';

type StatusColor = 'success' | 'warn' | 'danger';
type RoleColor = 'admin' | 'provincial' | 'city';

interface StatusBadgeProps {
  /** 标签文字 */
  label?: ReactNode;
  /** 兼容旧调用：等价于 label */
  status?: ReactNode;
  color: StatusColor;
  size?: 'sm' | 'md';
}

interface RoleBadgeProps {
  label: ReactNode;
  role: RoleColor;
  size?: 'sm' | 'md';
}

const statusColorClasses: Record<StatusColor, string> = {
  success: 'bg-status-success/15 text-status-success border-status-success/30',
  warn: 'bg-status-warn/15 text-status-warn border-status-warn/30',
  danger: 'bg-status-danger/15 text-status-danger border-status-danger/30',
};

const roleColorClasses: Record<RoleColor, string> = {
  admin: 'bg-role-admin/15 text-role-admin border-role-admin/30',
  provincial: 'bg-role-provincial/15 text-role-provincial border-role-provincial/30',
  city: 'bg-role-city/15 text-role-city border-role-city/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

export function StatusBadge({ label, status, color, size = 'sm' }: StatusBadgeProps) {
  const text = label ?? status;
  return (
    <span
      className={[
        'inline-flex items-center rounded-base font-medium border',
        statusColorClasses[color],
        sizeClasses[size],
      ].join(' ')}
    >
      {text}
    </span>
  );
}

export function RoleBadge({ label, role, size = 'sm' }: RoleBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-base font-medium border',
        roleColorClasses[role],
        sizeClasses[size],
      ].join(' ')}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
