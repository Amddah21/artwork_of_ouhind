import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface LuxuryThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LuxuryThemeToggle: React.FC<LuxuryThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: {
      container: 'w-16 h-8',
      button: 'w-7 h-7',
      icon: 'w-3 h-3',
      padding: 'p-0.5'
    },
    md: {
      container: 'w-20 h-10',
      button: 'w-9 h-9',
      icon: 'w-4 h-4',
      padding: 'p-1'
    },
    lg: {
      container: 'w-24 h-12',
      button: 'w-11 h-11',
      icon: 'w-5 h-5',
      padding: 'p-1'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`luxury-theme-toggle-container ${className}`}>
      <button
        onClick={toggleTheme}
        className={`luxury-theme-toggle group relative overflow-hidden ${currentSize.container} ${currentSize.padding}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 rounded-full transition-all duration-500 group-hover:from-amber-100 group-hover:via-orange-100 group-hover:to-yellow-100 dark:group-hover:from-slate-700 dark:group-hover:via-slate-600 dark:group-hover:to-slate-500" />
        
        {/* Golden Border */}
        <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Inner Glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-amber-200/20 via-orange-200/20 to-yellow-200/20 dark:from-slate-500/20 dark:via-slate-400/20 dark:to-slate-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Toggle Button */}
        <div className={`relative ${currentSize.button} transition-all duration-500 ease-in-out transform ${isDark ? 'translate-x-full' : 'translate-x-0'}`}>
          {/* Button Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-slate-600 dark:via-slate-500 dark:to-slate-400 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300" />
          
          {/* Button Border */}
          <div className="absolute inset-0 rounded-full border border-amber-300 dark:border-slate-300 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Sun Icon */}
            <div className={`absolute transition-all duration-500 ${isDark ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
              <Sun className={`${currentSize.icon} text-amber-700 dark:text-amber-300 transition-all duration-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 group-hover:scale-110`} />
            </div>
            
            {/* Moon Icon */}
            <div className={`absolute transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'}`}>
              <Moon className={`${currentSize.icon} text-slate-700 dark:text-slate-200 transition-all duration-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 group-hover:scale-110`} />
            </div>
          </div>
          
          {/* Icon Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-amber-400/20 dark:bg-slate-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" style={{ animationDelay: '0.2s' }} />
        
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Luxury Shadow */}
        <div className="absolute inset-0 rounded-full shadow-lg shadow-amber-200/50 dark:shadow-slate-400/50 opacity-0 group-hover:opacity-100 group-hover:shadow-xl group-hover:shadow-amber-300/60 dark:group-hover:shadow-slate-300/60 transition-all duration-300" />
      </button>
    </div>
  );
};

export default LuxuryThemeToggle;
