interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-yaozhiyan-primary text-white hover:bg-yaozhiyan-primaryDark focus:ring-yaozhiyan-primary',
    secondary: 'bg-yaozhiyan-secondary text-white hover:bg-yaozhiyan-secondaryLight focus:ring-yaozhiyan-secondary',
    outline: 'border-2 border-yaozhiyan-primary text-yaozhiyan-primary hover:bg-yaozhiyan-primary hover:text-white focus:ring-yaozhiyan-primary',
    ghost: 'text-yaozhiyan-gray-600 hover:bg-yaozhiyan-gray-100 focus:ring-yaozhiyan-gray-300',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}