interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-yaozhiyan-gray-200 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}