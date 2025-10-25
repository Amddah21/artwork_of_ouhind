import React, { useEffect, useRef } from 'react';

interface ScreenshotDetectionProps {
  onScreenshotAttempt?: () => void;
  children: React.ReactNode;
}

const ScreenshotDetection: React.FC<ScreenshotDetectionProps> = ({
  onScreenshotAttempt,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        console.warn('⚠️ DevTools detected - Screenshot protection active');
        if (onScreenshotAttempt) {
          onScreenshotAttempt();
        }
      }
    };

    // Monitor window resize (DevTools opening)
    const handleResize = () => {
      setTimeout(detectDevTools, 100);
    };

    // Monitor visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn('⚠️ Tab hidden - Potential screenshot attempt');
        if (onScreenshotAttempt) {
          onScreenshotAttempt();
        }
      }
    };

    // Detect right-click attempts
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      console.warn('⚠️ Right-click blocked - Screenshot protection active');
      if (onScreenshotAttempt) {
        onScreenshotAttempt();
      }
      return false;
    };

    // Detect keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Screenshot shortcuts
      if (
        e.key === 'PrintScreen' ||
        (e.altKey && e.key === 'PrintScreen') ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        (e.metaKey && e.shiftKey && e.key === '3') ||
        (e.metaKey && e.shiftKey && e.key === '4') ||
        (e.metaKey && e.shiftKey && e.key === '5')
      ) {
        e.preventDefault();
        console.warn('⚠️ Screenshot shortcut blocked - Protection active');
        if (onScreenshotAttempt) {
          onScreenshotAttempt();
        }
        return false;
      }
    };

    // Detect drag and drop attempts
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      console.warn('⚠️ Drag attempt blocked - Protection active');
      if (onScreenshotAttempt) {
        onScreenshotAttempt();
      }
      return false;
    };

    // Detect selection attempts
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      console.warn('⚠️ Selection blocked - Protection active');
      if (onScreenshotAttempt) {
        onScreenshotAttempt();
      }
      return false;
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    container.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('selectstart', handleSelectStart);

    // Monitor for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('dragstart', handleDragStart);
      container.removeEventListener('selectstart', handleSelectStart);
      clearInterval(devToolsInterval);
    };
  }, [onScreenshotAttempt]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        KhtmlUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default ScreenshotDetection;
