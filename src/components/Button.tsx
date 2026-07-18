import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'default' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  icon?: ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-rock-blue text-steel-white hover:bg-rock-hover',
  default:
    'bg-steel-white text-steel-gray border border-steel-light-gray hover:border-rock-hover hover:text-rock-blue',
  danger: 'bg-status-danger text-steel-white hover:bg-status-danger/90',
  outline: 'bg-transparent text-rock-blue border border-rock-blue hover:bg-rock-blue hover:text-steel-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  icon,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-base shadow-sm',
        'transition-colors duration-150 ease-fade focus:outline-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" strokeWidth={1.5} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
