import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Example component showing theme usage
export const ThemeExample: React.FC = () => {
  const { state, setMode, isDark, isLight, isAuto } = useTheme();

  return (
    <div className="p-6 rounded-lg" style={{ 
      backgroundColor: 'var(--color-surface)', 
      border: '1px solid var(--color-border)' 
    }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
        Theme Example
      </h2>
      
      <div className="space-y-4">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Current theme: <strong>{state.resolvedTheme}</strong>
        </p>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('light')}
            className={`px-3 py-1 rounded text-sm ${
              isLight ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            ☀️ Light
          </button>
          <button 
            onClick={() => setMode('dark')}
            className={`px-3 py-1 rounded text-sm ${
              isDark ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            🌙 Dark
          </button>
          <button 
            onClick={() => setMode('auto')}
            className={`px-3 py-1 rounded text-sm ${
              isAuto ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            🔄 Auto
          </button>
        </div>
        
        <div className="p-4 rounded" style={{ 
          backgroundColor: 'var(--color-background)', 
          color: 'var(--color-text)' 
        }}>
          This box uses CSS variables and will change colors with the theme!
        </div>
      </div>
    </div>
  );
};

