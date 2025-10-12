import { FC } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} group cursor-pointer`}>
      <img
        src="/logo3.png"
        alt="Omhind Fatima Douirani - Artiste Logo"
        className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
        loading="lazy"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default Logo;
