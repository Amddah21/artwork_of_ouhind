import { useEffect, useCallback } from 'react';

interface ProtectionOptions {
  enableRightClickProtection?: boolean;
  enableDragProtection?: boolean;
  enableKeyboardProtection?: boolean;
  enablePrintProtection?: boolean;
  enableScreenshotProtection?: boolean;
  showProtectionMessages?: boolean;
  protectionMessage?: string;
}

const defaultOptions: ProtectionOptions = {
  enableRightClickProtection: true,
  enableDragProtection: true,
  enableKeyboardProtection: true,
  enablePrintProtection: true,
  enableScreenshotProtection: true,
  showProtectionMessages: true,
  protectionMessage: '❌ Action non autorisée - Image protégée par copyright © Mamany-Art'
};

export const useCopyrightProtection = (options: ProtectionOptions = {}) => {
  const config = { ...defaultOptions, ...options };

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
            Copyright © Mamany-Art
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

  const disableRightClick = useCallback((e: MouseEvent) => {
    if (!config.enableRightClickProtection) return;
    
    e.preventDefault();
    e.stopPropagation();
    showProtectionMessage('❌ Vous ne pouvez pas télécharger l\'image, elle est protégée');
    return false;
  }, [config.enableRightClickProtection, showProtectionMessage]);

  const disableDrag = useCallback((e: DragEvent) => {
    if (!config.enableDragProtection) return;
    
    e.preventDefault();
    e.stopPropagation();
    showProtectionMessage('❌ Glisser-déposer désactivé - Image protégée');
    return false;
  }, [config.enableDragProtection, showProtectionMessage]);

  const disableKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    if (!config.enableKeyboardProtection) return;

    const isProtectedShortcut = (
      // Screenshot shortcuts
      (e.ctrlKey && e.shiftKey && e.key === 'S') || // Ctrl+Shift+S
      (e.metaKey && e.shiftKey && e.key === '4') || // Cmd+Shift+4 (Mac)
      (e.metaKey && e.shiftKey && e.key === '3') || // Cmd+Shift+3 (Mac)
      (e.key === 'PrintScreen') || // Print Screen
      (e.altKey && e.key === 'PrintScreen') || // Alt+PrintScreen
      
      // Save/Copy shortcuts
      (e.ctrlKey && e.key === 's') || // Ctrl+S (Save)
      (e.ctrlKey && e.key === 'c') || // Ctrl+C (Copy)
      (e.ctrlKey && e.key === 'v') || // Ctrl+V (Paste)
      (e.ctrlKey && e.key === 'a') || // Ctrl+A (Select All)
      (e.ctrlKey && e.key === 'p') || // Ctrl+P (Print)
      
      // Mac shortcuts
      (e.metaKey && e.key === 's') || // Cmd+S (Mac Save)
      (e.metaKey && e.key === 'c') || // Cmd+C (Mac Copy)
      (e.metaKey && e.key === 'a') || // Cmd+A (Mac Select All)
      (e.metaKey && e.key === 'v') || // Cmd+V (Mac Paste)
      
      // Developer tools
      (e.key === 'F12') || // F12 (DevTools)
      (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I (DevTools)
      (e.ctrlKey && e.key === 'u') || // Ctrl+U (View Source)
      (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C (Inspect)
      
      // Other potentially harmful shortcuts
      (e.ctrlKey && e.key === 'h') || // Ctrl+H (History)
      (e.ctrlKey && e.key === 'j') || // Ctrl+J (Downloads)
      (e.ctrlKey && e.shiftKey && e.key === 'Delete') // Ctrl+Shift+Delete
    );

    if (isProtectedShortcut) {
      e.preventDefault();
      e.stopPropagation();
      showProtectionMessage('❌ Raccourci clavier désactivé - Image protégée par copyright');
      return false;
    }
  }, [config.enableKeyboardProtection, showProtectionMessage]);

  const disablePrint = useCallback((e: Event) => {
    if (!config.enablePrintProtection) return;
    
    e.preventDefault();
    showProtectionMessage('❌ Impression désactivée - Image protégée par copyright');
    return false;
  }, [config.enablePrintProtection, showProtectionMessage]);

  const disableTextSelection = useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const disableTouchActions = useCallback((e: TouchEvent) => {
    if (!config.enableScreenshotProtection) return;
    
    // Prevent long press on mobile devices
    if (e.touches.length > 1) {
      e.preventDefault();
      showProtectionMessage('❌ Action tactile désactivée - Image protégée');
    }
  }, [config.enableScreenshotProtection, showProtectionMessage]);

  const addImageProtection = useCallback((element: HTMLElement) => {
    if (!element) return;

    // Add protection attributes
    element.setAttribute('draggable', 'false');
    element.setAttribute('oncontextmenu', 'return false;');
    element.setAttribute('onselectstart', 'return false;');
    element.setAttribute('onmousedown', 'return false;');

    // Add CSS classes
    element.classList.add('no-context-menu', 'protected-image');

    // Add event listeners
    element.addEventListener('contextmenu', disableRightClick, { passive: false });
    element.addEventListener('dragstart', disableDrag, { passive: false });
    element.addEventListener('selectstart', disableTextSelection, { passive: false });
    element.addEventListener('touchstart', disableTouchActions, { passive: false });

    return () => {
      element.removeEventListener('contextmenu', disableRightClick);
      element.removeEventListener('dragstart', disableDrag);
      element.removeEventListener('selectstart', disableTextSelection);
      element.removeEventListener('touchstart', disableTouchActions);
    };
  }, [disableRightClick, disableDrag, disableTextSelection, disableTouchActions]);

  useEffect(() => {
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

    // Disable text selection globally
    document.addEventListener('selectstart', disableTextSelection, { passive: false });

    // Add CSS protection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('dragstart', disableDrag);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      window.removeEventListener('beforeprint', disablePrint);
      document.removeEventListener('touchstart', disableTouchActions);
      document.removeEventListener('selectstart', disableTextSelection);
      
      // Remove CSS
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [
    config.enableRightClickProtection,
    config.enableDragProtection,
    config.enableKeyboardProtection,
    config.enablePrintProtection,
    config.enableScreenshotProtection,
    disableRightClick,
    disableDrag,
    disableKeyboardShortcuts,
    disablePrint,
    disableTouchActions,
    disableTextSelection
  ]);

  return {
    showProtectionMessage,
    addImageProtection,
    disableRightClick,
    disableDrag,
    disableKeyboardShortcuts
  };
};
