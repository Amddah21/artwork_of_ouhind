# Theme System

A comprehensive theme management system with light mode, dark mode, and auto mode functionality.

## Features

- 🌞 **Light Mode**: Clean, bright interface
- 🌙 **Dark Mode**: Easy on the eyes for low-light environments  
- 🔄 **Auto Mode**: Automatically follows system preference
- 💾 **Persistent**: Remembers your choice in localStorage
- 🎨 **CSS Variables**: Easy to customize colors
- ⚡ **Smooth Transitions**: Animated theme changes
- 📱 **Responsive**: Works on all devices

## Quick Start

### 1. Wrap your app with providers

```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GalleryProvider } from '@/contexts/GalleryContext';
import '@/styles/theme.css';

function App() {
  return (
    <ThemeProvider>
      <GalleryProvider>
        {/* Your app content */}
      </GalleryProvider>
    </ThemeProvider>
  );
}
```

### 2. Use the theme hook

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { 
    state, 
    setMode, 
    toggleTheme, 
    isDark, 
    isLight, 
    isAuto 
  } = useTheme();

  return (
    <div>
      <p>Current theme: {state.resolvedTheme}</p>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={() => setMode('light')}>Light Mode</button>
      <button onClick={() => setMode('auto')}>Auto Mode</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### 3. Add theme toggle components

```tsx
import { ThemeToggle, ThemeToggleButton, ThemeStatus } from '@/components/ThemeToggle';

// Button group toggle
<ThemeToggle variant="button" showLabel={true} />

// Dropdown selector
<ThemeToggle variant="select" showLabel={true} />

// Simple toggle button
<ThemeToggleButton />

// Status indicator
<ThemeStatus />
```

## CSS Variables

The theme system provides CSS custom properties that automatically update based on the current theme:

```css
/* Use these variables in your CSS */
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.my-button {
  background-color: var(--color-primary);
  color: white;
}

.my-button:hover {
  background-color: var(--color-primary-hover);
}
```

### Available Variables

- `--color-primary` / `--color-primary-hover`
- `--color-secondary`
- `--color-background`
- `--color-surface` / `--color-surface-hover`
- `--color-text` / `--color-text-secondary` / `--color-text-muted`
- `--color-border` / `--color-border-hover`
- `--color-shadow` / `--color-shadow-hover`
- `--color-success` / `--color-warning` / `--color-error` / `--color-info`

## Theme Modes

### Light Mode
- Clean white backgrounds
- Dark text for readability
- Subtle shadows and borders

### Dark Mode  
- Dark backgrounds to reduce eye strain
- Light text for contrast
- Adjusted shadows and borders

### Auto Mode
- Automatically detects system preference
- Updates when system theme changes
- Falls back to light mode if detection fails

## Integration with Gallery Context

The theme system works seamlessly with your existing GalleryContext. The theme colors will automatically apply to gallery cards and components when you use the provided CSS classes:

```tsx
// Gallery card with theme support
<div className="gallery-card">
  <h2 className="gallery-title">Gallery Name</h2>
  <p className="gallery-description">Description</p>
  <span className="gallery-count">12 artworks</span>
</div>
```

## Customization

### Custom Colors

You can extend the theme colors by modifying `src/contexts/ThemeContext.tsx`:

```tsx
export const themeColors = {
  light: {
    // Add your custom colors
    customColor: '#your-color',
  },
  dark: {
    // Add your custom colors
    customColor: '#your-dark-color',
  }
};
```

### Custom CSS Classes

Add your own theme-aware CSS classes in `src/styles/theme.css`:

```css
.my-custom-component {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease;
}

.my-custom-component:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}
```

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers

## TypeScript Support

Full TypeScript support with proper type definitions for all theme-related functions and components.

