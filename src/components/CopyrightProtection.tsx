import React, { useEffect, useRef, useState } from 'react';

interface CopyrightProtectionProps {
  children: React.ReactNode;
  artistName?: string;
  artworkTitle?: string;
  year?: string;
  className?: string;
}

const CopyrightProtection: React.FC<CopyrightProtectionProps> = ({
  children,
  artistName = 'Omhind',
  artworkTitle,
  year = '2025',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (DevTools), Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+A
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'x')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable image dragging
    const handleImageDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    container.addEventListener('contextmenu', handleContextMenu);
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('selectstart', handleSelectStart);
    container.addEventListener('drag', handleImageDrag);

    // Disable image context menu globally for this container
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('contextmenu', handleContextMenu);
      img.addEventListener('dragstart', handleImageDrag);
      img.draggable = false;
    });

    // Add CSS to prevent selection and dragging
    container.style.userSelect = 'none';
    (container.style as any).webkitUserSelect = 'none';
    (container.style as any).mozUserSelect = 'none';
    (container.style as any).msUserSelect = 'none';
    (container.style as any).webkitTouchCallout = 'none';
    (container.style as any).webkitUserDrag = 'none';
    (container.style as any).khtmlUserSelect = 'none';

    setIsProtected(true);

    // Cleanup
    return () => {
      container.removeEventListener('contextmenu', handleContextMenu);
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('dragstart', handleDragStart);
      container.removeEventListener('selectstart', handleSelectStart);
      container.removeEventListener('drag', handleImageDrag);
      
      images.forEach(img => {
        img.removeEventListener('contextmenu', handleContextMenu);
        img.removeEventListener('dragstart', handleImageDrag);
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`copyright-protection-container ${className}`}
      style={{
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        KhtmlUserSelect: 'none'
      } as React.CSSProperties}
    >

      {/* Invisible overlay to catch interactions */}
      <div 
        className="copyright-protection-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: 'auto',
          background: 'transparent'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />

      {/* Content */}
      <div className="copyright-protected-content">
        {children}
      </div>

      {/* Protection Status Indicator */}
      {isProtected && (
        <div className="copyright-protection-indicator">
          <div className="protection-badge">
            🔒 Protégé
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyrightProtection;
