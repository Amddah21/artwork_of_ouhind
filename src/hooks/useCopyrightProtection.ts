import { useEffect, useCallback, useRef } from 'react';

interface ProtectionOptions {
  enableRightClickProtection?: boolean;
  enableDragProtection?: boolean;
  enableKeyboardProtection?: boolean;
  enablePrintProtection?: boolean;
  enableScreenshotProtection?: boolean;
  enableZoomProtection?: boolean;
  enableDevToolsProtection?: boolean;
  showProtectionMessages?: boolean;
  protectionMessage?: string;
}

const defaultOptions: ProtectionOptions = {
  enableRightClickProtection: true,
  enableDragProtection: true,
  enableKeyboardProtection: true,
  enablePrintProtection: true,
  enableScreenshotProtection: true,
  enableZoomProtection: true,
  enableDevToolsProtection: true,
  showProtectionMessages: true,
  protectionMessage: '❌ Action non autorisée - Image protégée par copyright © Omhind'
};

export const useCopyrightProtection = (options: ProtectionOptions = {}) => {
  const config = { ...defaultOptions, ...options };
  const devToolsOpenRef = useRef(false);

  // Helper function to detect mobile devices
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  }, []);

  const showProtectionMessage = useCallback((message?: string) => {
    if (!config.showProtectionMessages) return;

    const msg = message || config.protectionMessage;
    
    // Create protection message element
    const protectionDiv = document.createElement('div');
    protectionDiv.className = 'protection-message';
    protectionDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <div style="font-size: 16px;">🛡️</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 3px; font-size: 12px;">Image Protégée</div>
          <div style="font-size: 11px;">${msg}</div>
          <div style="font-size: 10px; margin-top: 3px; opacity: 0.8;">
            Copyright © Omhind
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(protectionDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (protectionDiv.parentNode) {
        protectionDiv.parentNode.removeChild(protectionDiv);
      }
    }, 3000);
  }, [config.showProtectionMessages, config.protectionMessage]);

  // ============================================================================
  // SECTION 1: RIGHT-CLICK AND CONTEXT MENU PROTECTION
  // ============================================================================
  // Blocks right-click menu to prevent "Save image as..." and other context options
  // Works on: All browsers (Chrome, Firefox, Safari, Edge)
  const disableRightClick = useCallback((e: MouseEvent) => {
    if (!config.enableRightClickProtection) return;
    
    e.preventDefault();
    e.stopPropagation();
    showProtectionMessage('❌ Vous ne pouvez pas télécharger l\'image, elle est protégée');
    return false;
  }, [config.enableRightClickProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 2: DRAG AND DROP PROTECTION
  // ============================================================================
  // Prevents dragging images out of the page to desktop or other applications
  // Works on: All browsers and operating systems
  const disableDrag = useCallback((e: DragEvent) => {
    if (!config.enableDragProtection) return;
    
    e.preventDefault();
    e.stopPropagation();
    showProtectionMessage('❌ Glisser-déposer désactivé - Image protégée');
    return false;
  }, [config.enableDragProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 3: KEYBOARD SHORTCUTS PROTECTION
  // ============================================================================
  // Blocks keyboard shortcuts for screenshots, save, copy, print, and DevTools
  // Cross-platform: Windows (Ctrl), Mac (Cmd), Linux shortcuts
  const disableKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    if (!config.enableKeyboardProtection) return;

    // Windows/Linux: Ctrl, Mac: Cmd or Meta key
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    const isProtectedShortcut = (
      // Screenshot shortcuts (Windows/Linux)
      (isCtrlOrCmd && isShift && e.key === 'S') || // Ctrl+Shift+S (Windows Screenshot)
      (e.key === 'PrintScreen') || // Print Screen
      (e.altKey && e.key === 'PrintScreen') || // Alt+PrintScreen
      
      // Mac screenshot shortcuts
      (e.metaKey && isShift && e.key === '4') || // Cmd+Shift+4 (Mac screenshot selection)
      (e.metaKey && isShift && e.key === '3') || // Cmd+Shift+3 (Mac full screenshot)
      (e.metaKey && isShift && e.key === '5') || // Cmd+Shift+5 (Mac screenshot toolbar)
      
      // Save/Copy shortcuts (all platforms)
      (isCtrlOrCmd && e.key === 's') || // Save
      (isCtrlOrCmd && e.key === 'c') || // Copy
      (isCtrlOrCmd && e.key === 'x') || // Cut
      (isCtrlOrCmd && e.key === 'v') || // Paste
      (isCtrlOrCmd && e.key === 'a') || // Select All
      (isCtrlOrCmd && e.key === 'p') || // Print
      (isCtrlOrCmd && e.key === 'u') || // View Source
      
      // Developer tools shortcuts
      (e.key === 'F12') || // F12 (DevTools)
      (isCtrlOrCmd && isShift && e.key === 'I') || // Ctrl+Shift+I (DevTools)
      (isCtrlOrCmd && isShift && e.key === 'C') || // Ctrl+Shift+C (Inspect Element)
      (isCtrlOrCmd && isShift && e.key === 'J') || // Ctrl+Shift+J (Console)
      
      // Other protected shortcuts
      (isCtrlOrCmd && e.key === 'h') || // History
      (isCtrlOrCmd && e.key === 'j') || // Downloads
      (isCtrlOrCmd && isShift && e.key === 'Delete') // Clear browsing data
    );

    if (isProtectedShortcut) {
      e.preventDefault();
      e.stopPropagation();
      showProtectionMessage('❌ Raccourci clavier désactivé - Image protégée par copyright');
      return false;
    }
  }, [config.enableKeyboardProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 4: PRINT PROTECTION
  // ============================================================================
  // Prevents printing the page with artwork visible
  // Works on: All browsers
  const disablePrint = useCallback((e: Event) => {
    if (!config.enablePrintProtection) return;
    
    e.preventDefault();
    showProtectionMessage('❌ Impression désactivée - Image protégée par copyright');
    return false;
  }, [config.enablePrintProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 5: TEXT SELECTION PROTECTION
  // ============================================================================
  // Prevents selecting text and images on the page
  // Works on: All browsers
  const disableTextSelection = useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // ============================================================================
  // SECTION 6: TOUCH ACTIONS PROTECTION (MOBILE/TABLET)
  // ============================================================================
  // Prevents long-press, pinch-to-zoom, and other touch gestures
  // Works on: iOS Safari, Chrome Android, Samsung Internet
  const disableTouchActions = useCallback((e: TouchEvent) => {
    if (!config.enableScreenshotProtection) return;
    
    // Prevent long press on mobile devices
    if (e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      showProtectionMessage('❌ Action tactile désactivée - Image protégée');
    }
  }, [config.enableScreenshotProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 7: ZOOM PROTECTION
  // ============================================================================
  // Prevents zooming via pinch gestures (mobile) and keyboard shortcuts (Ctrl/Cmd + +/-)
  // Works on: All browsers and devices
  const disableZoom = useCallback((e: WheelEvent | TouchEvent | KeyboardEvent) => {
    if (!config.enableZoomProtection) return;

    // Prevent keyboard zoom (Ctrl/Cmd + + or -)
    if (e instanceof KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 173)) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionMessage('❌ Zoom désactivé - Image protégée');
        return false;
      }
    }

    // Prevent mouse wheel zoom (Ctrl + scroll)
    if (e instanceof WheelEvent) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionMessage('❌ Zoom désactivé - Image protégée');
        return false;
      }
    }

    // Prevent pinch zoom on touch devices
    if (e instanceof TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionMessage('❌ Zoom tactile désactivé - Image protégée');
        return false;
      }
    }
  }, [config.enableZoomProtection, showProtectionMessage]);

  // ============================================================================
  // SECTION 8: SCREENSHOT AND RECORDING DETECTION
  // ============================================================================
  // Attempts to detect and warn when screenshots or recordings occur
  // Limited effectiveness but provides deterrent
  // Works on: Modern browsers (Desktop only - less aggressive on mobile)
  const detectScreenshots = useCallback(() => {
    if (!config.enableScreenshotProtection) return;
    
    // Skip aggressive detection on mobile to prevent false positives
    if (isMobileDevice()) {
      return () => {}; // Return empty cleanup function
    }

    try {
      // Browser-specific detection methods
      
      // Chrome DevTools detection via console (Desktop only)
      const consoleWarn = console.warn;
      console.warn = function(...args: any[]) {
        if (args.some(arg => typeof arg === 'string' && (
          arg.includes('DevTools') || 
          arg.includes('inspect') || 
          arg.includes('console')
        ))) {
          showProtectionMessage('⚠️ DevTools détecté - Accès non autorisé');
        }
        return consoleWarn.apply(console, args);
      };

      // Detect when page loses focus (potential screenshot)
      const handleVisibilityChange = () => {
        if (document.hidden && !document.hasFocus()) {
          // Might indicate screenshot attempt
          console.log('🛡️ Page visibility changed - potential screenshot attempt');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Detect blur (window minimized or screenshot)
      window.addEventListener('blur', () => {
        console.log('🛡️ Window blurred - potential screenshot attempt');
      });

      return () => {
        console.warn = consoleWarn;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } catch (error) {
      console.error('Screenshot detection error:', error);
    }
  }, [config.enableScreenshotProtection, showProtectionMessage, isMobileDevice]);

  // ============================================================================
  // SECTION 9: DEVTOOLS DETECTION AND BLOCKING
  // ============================================================================
  // Detects and tries to discourage DevTools usage
  // Works on: Chrome, Edge, Firefox, Safari (Desktop only - disabled on mobile)
  const detectDevTools = useCallback(() => {
    if (!config.enableDevToolsProtection) return;
    
    // Skip DevTools detection on mobile devices to prevent false positives
    if (isMobileDevice()) {
      console.log('🛡️ DevTools detection disabled on mobile device');
      return () => {}; // Return empty cleanup function
    }

    const devToolsCheck = setInterval(() => {
      try {
        // Method 1: Detect DevTools by checking window width difference
        const windowWidth = window.innerWidth || window.outerWidth;
        const screenWidth = screen.width;
        const widthDiff = screenWidth - windowWidth;
        
        // Method 2: Check console detection (skip on mobile)
        if (!isMobileDevice()) {
          const element = new Image();
          Object.defineProperty(element, 'id', {
            get: function() {
              if (!devToolsOpenRef.current) {
                devToolsOpenRef.current = true;
                showProtectionMessage('⚠️ DevTools détecté - Accès non autorisé aux images');
              }
            }
          });
          
          // Method 3: Detect developer tools by console spam
          console.log('%c', element);
        }

        // Method 4: Detect window resize (DevTools typically resizes window)
        // Only trigger on significant width differences to avoid mobile false positives
        if (widthDiff > 200 && widthDiff < 600) {
          if (!devToolsOpenRef.current) {
            devToolsOpenRef.current = true;
            showProtectionMessage('⚠️ DevTools ouvert détecté - Accès restreint');
          }
        } else {
          devToolsOpenRef.current = false;
        }
      } catch (error) {
        // Silently handle errors
      }
    }, 500);

    return () => clearInterval(devToolsCheck);
  }, [config.enableDevToolsProtection, showProtectionMessage, isMobileDevice]);

  // ============================================================================
  // SECTION 10: ADD PROTECTION TO SPECIFIC IMAGES
  // ============================================================================
  // Applies protection directly to image elements
  const addImageProtection = useCallback((element: HTMLElement) => {
    if (!element) return;

    // Add protection attributes
    element.setAttribute('draggable', 'false');
    element.setAttribute('oncontextmenu', 'return false;');
    element.setAttribute('onselectstart', 'return false;');
    element.setAttribute('oncopy', 'return false;');
    element.setAttribute('oncut', 'return false;');
    element.setAttribute('onpaste', 'return false;');

    // Add CSS classes
    element.classList.add('no-context-menu', 'protected-image');

    // Add event listeners
    element.addEventListener('contextmenu', disableRightClick, { passive: false });
    element.addEventListener('dragstart', disableDrag, { passive: false });
    element.addEventListener('selectstart', disableTextSelection, { passive: false });
    element.addEventListener('touchstart', disableTouchActions, { passive: false });
    element.addEventListener('copy', (e) => e.preventDefault(), { passive: false });
    element.addEventListener('cut', (e) => e.preventDefault(), { passive: false });
    element.addEventListener('paste', (e) => e.preventDefault(), { passive: false });

    return () => {
      element.removeEventListener('contextmenu', disableRightClick);
      element.removeEventListener('dragstart', disableDrag);
      element.removeEventListener('selectstart', disableTextSelection);
      element.removeEventListener('touchstart', disableTouchActions);
    };
  }, [disableRightClick, disableDrag, disableTextSelection, disableTouchActions]);

  // ============================================================================
  // SECTION 11: MAIN EFFECT - APPLY ALL PROTECTIONS
  // ============================================================================
  useEffect(() => {
    console.log('🛡️ Copyright protection activated');

    // Global event listeners
    if (config.enableRightClickProtection) {
      document.addEventListener('contextmenu', disableRightClick, { passive: false });
    }
    
    if (config.enableDragProtection) {
      document.addEventListener('dragstart', disableDrag, { passive: false });
    }
    
    if (config.enableKeyboardProtection) {
      document.addEventListener('keydown', disableKeyboardShortcuts, { passive: false });
    }
    
    if (config.enablePrintProtection) {
      window.addEventListener('beforeprint', disablePrint);
    }
    
    if (config.enableScreenshotProtection) {
      document.addEventListener('touchstart', disableTouchActions, { passive: false });
    }

    // Zoom protection - Mouse wheel and keyboard
    if (config.enableZoomProtection) {
      document.addEventListener('wheel', disableZoom, { passive: false });
      document.addEventListener('keydown', disableZoom, { passive: false });
      document.addEventListener('touchstart', disableZoom, { passive: false });
      document.addEventListener('touchmove', disableZoom, { passive: false });
      
      // Set viewport meta tag to prevent zoom on mobile
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Disable pinch zoom via CSS
      document.documentElement.style.touchAction = 'pan-x pan-y';
    }

    // Disable text selection globally
    document.addEventListener('selectstart', disableTextSelection, { passive: false });

    // Prevent copy, cut, paste globally
    document.addEventListener('copy', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('cut', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('paste', (e) => e.preventDefault(), { passive: false });

    // Add CSS protection styles
    const style = document.createElement('style');
    style.id = 'copyright-protection-styles';
    style.textContent = `
      /* Disable text selection */
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Enable selection for input fields */
      input, textarea, [contenteditable], .editable {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Disable dragging images */
      img, .protected-image {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        -webkit-touch-callout: none !important;
        pointer-events: auto !important;
      }
      
      /* Disable context menu */
      .no-context-menu {
        -webkit-context-menu: none !important;
      }
      
      /* Protection message styling */
      .protection-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: protectionPulse 0.3s ease-in-out;
        backdrop-filter: blur(10px);
      }
      
      @keyframes protectionPulse {
        0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Screenshot detection
    const screenshotCleanup = detectScreenshots();
    
    // DevTools detection
    const devToolsCleanup = detectDevTools();

    // Cleanup function
    return () => {
      console.log('🛡️ Copyright protection deactivated');
      
      // Remove event listeners
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('dragstart', disableDrag);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      window.removeEventListener('beforeprint', disablePrint);
      document.removeEventListener('touchstart', disableTouchActions);
      document.removeEventListener('selectstart', disableTextSelection);
      document.removeEventListener('wheel', disableZoom);
      document.removeEventListener('keydown', disableZoom);
      document.removeEventListener('touchstart', disableZoom);
      document.removeEventListener('touchmove', disableZoom);
      document.removeEventListener('copy', () => {});
      document.removeEventListener('cut', () => {});
      document.removeEventListener('paste', () => {});
      
      // Remove CSS
      const existingStyle = document.getElementById('copyright-protection-styles');
      if (existingStyle) {
        existingStyle.parentNode?.removeChild(existingStyle);
      }
      
      // Cleanup screenshot and devtools detection
      if (screenshotCleanup) screenshotCleanup();
      if (devToolsCleanup) devToolsCleanup();
    };
  }, [
    config.enableRightClickProtection,
    config.enableDragProtection,
    config.enableKeyboardProtection,
    config.enablePrintProtection,
    config.enableScreenshotProtection,
    config.enableZoomProtection,
    config.enableDevToolsProtection,
    disableRightClick,
    disableDrag,
    disableKeyboardShortcuts,
    disablePrint,
    disableTouchActions,
    disableZoom,
    disableTextSelection,
    detectScreenshots,
    detectDevTools,
    isMobileDevice
  ]);

  return {
    showProtectionMessage,
    addImageProtection,
    disableRightClick,
    disableDrag,
    disableKeyboardShortcuts
  };
};