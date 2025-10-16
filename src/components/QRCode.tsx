import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface QRCodeComponentProps {
  url: string;
  title?: string;
  description?: string;
  size?: number;
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  url,
  title = "Scan QR Code",
  description = "Scan with your phone to open",
  size = 200,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;
      
      try {
        setIsGenerating(true);
        setError(null);
        
        await QRCode.toCanvas(canvasRef.current, url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [url, size]);

  const handleQRClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`w-fit ${className}`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {error ? (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        ) : (
          <>
            <div className="relative inline-block">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={handleQRClick}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  display: isGenerating ? 'none' : 'block'
                }}
              />
              {isGenerating && (
                <div 
                  className="border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50"
                  style={{ width: size, height: size }}
                >
                  <div className="text-gray-500 text-sm">Generating QR...</div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleDirectClick}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
              
              <p className="text-xs text-gray-500">
                Click QR code or button to open
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeComponent;
