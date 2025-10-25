import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { getConnectionStatus, monitorConnection } from '@/lib/optimizedSupabase';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Start monitoring connection
    const stopMonitoring = monitorConnection();
    
    // Update status periodically
    const statusInterval = setInterval(() => {
      setStatus(getConnectionStatus());
    }, 1000);

    return () => {
      stopMonitoring();
      clearInterval(statusInterval);
    };
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connecté';
      case 'disconnected':
        return 'Déconnecté';
      case 'checking':
        return 'Vérification...';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (status === 'connected') {
    return null; // Don't show when connected
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200 ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border max-w-xs">
          <h4 className="font-semibold text-gray-800 mb-2">État de la connexion</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Base de données:</span>
              <span className={status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {getStatusText()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dernière vérification:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            {status === 'disconnected' && (
              <div className="mt-3 p-2 bg-red-50 rounded text-red-700 text-xs">
                ⚠️ Certaines fonctionnalités peuvent être limitées. 
                Les données seront synchronisées lors de la reconnexion.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
