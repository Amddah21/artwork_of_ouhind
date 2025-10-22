import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
}

type ThemeAction = 
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'SET_SYSTEM_THEME'; payload: 'light' | 'dark' }
  | { type: 'RESOLVE_THEME' };

const initialState: ThemeState = {
  mode: 'auto',
  resolvedTheme: 'light',
  systemTheme: 'light'
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_MODE':
      const newMode = action.payload;
      const resolvedTheme = newMode === 'auto' ? state.systemTheme : newMode;
      return {
        ...state,
        mode: newMode,
        resolvedTheme
      };
    case 'SET_SYSTEM_THEME':
      const newSystemTheme = action.payload;
      const newResolvedTheme = state.mode === 'auto' ? newSystemTheme : state.resolvedTheme;
      return {
        ...state,
        systemTheme: newSystemTheme,
        resolvedTheme: newResolvedTheme
      };
    case 'RESOLVE_THEME':
      return {
        ...state,
        resolvedTheme: state.mode === 'auto' ? state.systemTheme : state.mode
      };
    default:
      return state;
  }
};

interface ThemeContextType {
  state: ThemeState;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Detect system theme preference
  const detectSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Load theme from localStorage
  const loadThemeFromStorage = () => {
    try {
      const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
      if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
        dispatch({ type: 'SET_MODE', payload: savedMode });
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  };

  // Save theme to localStorage
  const saveThemeToStorage = (mode: ThemeMode) => {
    try {
      localStorage.setItem('theme-mode', mode);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.classList.toggle('light', theme === 'light');
    }
  };

  // Set theme mode
  const setMode = (mode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    saveThemeToStorage(mode);
  };

  // Toggle between light and dark (skips auto)
  const toggleTheme = () => {
    const newMode = state.resolvedTheme === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      dispatch({ type: 'SET_SYSTEM_THEME', payload: systemTheme });
    };

    // Set initial system theme
    dispatch({ type: 'SET_SYSTEM_THEME', payload: detectSystemTheme() });

    // Listen for changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  // Apply theme when resolved theme changes
  useEffect(() => {
    applyTheme(state.resolvedTheme);
  }, [state.resolvedTheme]);

  // Computed values
  const isDark = state.resolvedTheme === 'dark';
  const isLight = state.resolvedTheme === 'light';
  const isAuto = state.mode === 'auto';

  const value: ThemeContextType = {
    state,
    setMode,
    toggleTheme,
    isDark,
    isLight,
    isAuto
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// CSS Custom Properties for theming
export const themeColors = {
  light: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f9fafb',
    surfaceHover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  dark: {
    primary: '#60a5fa',
    primaryHover: '#3b82f6',
    secondary: '#9ca3af',
    background: '#111827',
    surface: '#1f2937',
    surfaceHover: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#374151',
    borderHover: '#4b5563',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.4)',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa'
  }
};

// Utility function to get theme colors
export const getThemeColors = (theme: 'light' | 'dark') => themeColors[theme];
