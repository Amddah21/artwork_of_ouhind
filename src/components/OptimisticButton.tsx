import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface OptimisticButtonProps {
  onClick: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

const OptimisticButton: React.FC<OptimisticButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
  successMessage = 'Succès!',
  errorMessage = 'Erreur'
}) => {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async () => {
    if (disabled || state === 'loading') return;
    
    setState('loading');
    
    try {
      await onClick();
      setState('success');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('error');
      console.error('Button action failed:', error);
      
      // Reset to idle after 3 seconds
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Chargement...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            {successMessage}
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="w-4 h-4 text-red-500 mr-2" />
            {errorMessage}
          </>
        );
      default:
        return children;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200';
    
    switch (state) {
      case 'loading':
        return `${baseClasses} bg-yellow-100 text-yellow-700 cursor-not-allowed ${className}`;
      case 'success':
        return `${baseClasses} bg-green-100 text-green-700 ${className}`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-700 ${className}`;
      default:
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 text-white ${className}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={getButtonClasses()}
    >
      {getButtonContent()}
    </button>
  );
};

export default OptimisticButton;
