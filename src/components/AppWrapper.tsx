import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GalleryProvider } from '@/contexts/GalleryContext';
import { ThemeToggle, ThemeStatus } from '@/components/ThemeToggle';
import '@/styles/theme.css';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <GalleryProvider>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
          {/* Theme controls - you can place these anywhere in your app */}
          <div className="fixed top-4 right-4 z-50">
            <div className="flex items-center gap-4">
              <ThemeStatus />
              <ThemeToggle variant="button" showLabel={false} />
            </div>
          </div>
          
          {/* Your app content */}
          {children}
        </div>
      </GalleryProvider>
    </ThemeProvider>
  );
};

// Example usage component
export const ExampleGalleryApp: React.FC = () => {
  return (
    <AppWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
          Artwork Gallery
        </h1>
        
        {/* Example gallery card */}
        <div className="gallery-card p-6 mb-6">
          <h2 className="gallery-title text-xl font-semibold mb-2">
            Sample Gallery
          </h2>
          <p className="gallery-description mb-4">
            This is an example gallery card that will automatically adapt to the current theme.
          </p>
          <div className="gallery-count text-sm">
            12 artworks
          </div>
        </div>

        {/* Example buttons */}
        <div className="flex gap-4 mb-6">
          <button className="btn-primary">
            Primary Button
          </button>
          <button className="btn-secondary">
            Secondary Button
          </button>
        </div>

        {/* Example input */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search galleries..." 
            className="input w-full max-w-md"
          />
        </div>

        {/* Theme selector dropdown */}
        <div className="mb-6">
          <ThemeToggle variant="select" showLabel={true} />
        </div>
      </div>
    </AppWrapper>
  );
};
