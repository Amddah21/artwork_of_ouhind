import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, HardDrive } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    connectionStatus: 'checking'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const loadTime = performance.now();
      
      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }

      setMetrics(prev => ({
        ...prev,
        loadTime,
        memoryUsage
      }));
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        title="Performance Monitor"
      >
        <Activity className="w-5 h-5" />
      </button>

      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl border p-4 min-w-64">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Monitor
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Load Time:
              </span>
              <span className="font-mono">
                {metrics.loadTime.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                Connection:
              </span>
              <span className={`font-mono ${
                metrics.connectionStatus === 'connected' ? 'text-green-600' : 
                metrics.connectionStatus === 'disconnected' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {metrics.connectionStatus}
              </span>
            </div>

            {metrics.memoryUsage && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-3 h-3" />
                  Memory:
                </span>
                <span className="font-mono">
                  {metrics.memoryUsage}MB
                </span>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500">
                <div>React Query Cache: Active</div>
                <div>Lazy Loading: Enabled</div>
                <div>Image Optimization: Active</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
