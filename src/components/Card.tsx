import { ReactNode } from 'react';

type CardVariant = 'light' | 'dark';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  light: 'bg-steel-white border border-steel-light-gray text-steel-gray',
  dark: 'bg-steel-dark text-steel-white border border-steel-dark',
};

export default function Card({
  children,
  variant = 'light',
  className = '',
  onClick,
  header,
  footer,
}: CardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={[
        'rounded-base shadow-sm p-4 transition-colors duration-150 ease-fade',
        variantClasses[variant],
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {header && (
        <div
          className={[
            'mb-3 pb-3 border-b',
            isDark ? 'border-steel-white/15' : 'border-steel-light-gray',
          ].join(' ')}
        >
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div
          className={[
            'mt-3 pt-3 border-t',
            isDark ? 'border-steel-white/15' : 'border-steel-light-gray',
          ].join(' ')}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
