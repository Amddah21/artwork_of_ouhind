import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'select';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true,
  variant = 'button' 
}) => {
  const { state, setMode, toggleTheme, isDark, isLight, isAuto } = useTheme();

  if (variant === 'select') {
    return (
      <div className={`theme-selector ${className}`}>
        {showLabel && (
          <label htmlFor="theme-select" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            Theme:
          </label>
        )}
        <select
          id="theme-select"
          value={state.mode}
          onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'auto')}
          className="theme-select"
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="auto">🔄 Auto</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          Theme:
        </span>
      )}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setMode('light')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            isLight ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
          }`}
          title="Light mode"
        >
          ☀️ Light
        </button>
        <button
          onClick={() => setMode('dark')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            isDark ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
          }`}
          title="Dark mode"
        >
          🌙 Dark
        </button>
        <button
          onClick={() => setMode('auto')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            isAuto ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
          }`}
          title="Auto mode (follows system preference)"
        >
          🔄 Auto
        </button>
      </div>
    </div>
  );
};

// Simple toggle button variant
export const ThemeToggleButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

// Theme status indicator
export const ThemeStatus: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state, isDark, isLight, isAuto } = useTheme();

  const getStatusText = () => {
    if (isAuto) {
      return `Auto (${state.systemTheme})`;
    }
    return isDark ? 'Dark' : 'Light';
  };

  const getStatusIcon = () => {
    if (isAuto) return '🔄';
    return isDark ? '🌙' : '☀️';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`} style={{ color: 'var(--color-text-secondary)' }}>
      <span>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
    </div>
  );
};
