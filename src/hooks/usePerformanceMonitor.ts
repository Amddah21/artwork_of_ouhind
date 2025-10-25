import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [Performance] ${componentName} loaded in ${loadTime}ms`);
      
      // Check memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log(`💾 [Memory] Used: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
      }
    }

    // Report to analytics in production
    if (process.env.NODE_ENV === 'production' && loadTime > 1000) {
      // Report slow loading components
      console.warn(`⚠️ [Performance] Slow component: ${componentName} (${loadTime}ms)`);
    }
  }, [componentName]);

  const markRenderStart = () => {
    renderStartTime.current = Date.now();
  };

  const markRenderEnd = () => {
    const renderTime = Date.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`⚠️ [Performance] Slow render: ${componentName} (${renderTime}ms)`);
    }
  };

  return { markRenderStart, markRenderEnd };
};

export const useImagePreloader = (srcs: string[]) => {
  useEffect(() => {
    const preloadImages = async () => {
      const promises = srcs.map(src => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(promises);
        console.log(`✅ [Performance] Preloaded ${srcs.length} images`);
      } catch (error) {
        console.warn('⚠️ [Performance] Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [srcs]);
};
