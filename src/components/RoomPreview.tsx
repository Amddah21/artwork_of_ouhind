import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, Maximize2, Minimize2, Move, Paintbrush } from 'lucide-react';
import { Button } from './ui/button';
import OptimizedImage from './OptimizedImage';

interface RoomPreviewProps {
  artwork: {
    id: string;
    image_url: string;
    title: string;
  };
  onClose: () => void;
}

interface RoomOption {
  id: string;
  name: string;
  image: string;
  wallColor: string;
}

const roomOptions: RoomOption[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    image: '/gallery-interior-1.jpg', // Using existing gallery images
    wallColor: '#f5f5f5'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    image: '/gallery-interior-2.jpg',
    wallColor: '#f8f6f0'
  },
  {
    id: 'office',
    name: 'Office',
    image: '/gallery-interior-1.jpg',
    wallColor: '#f5f5f5'
  },
  {
    id: 'gallery',
    name: 'Gallery Wall',
    image: '/gallery-interior-2.jpg',
    wallColor: '#ffffff'
  }
];

const wallColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Cream', value: '#f8f6f0' },
  { name: 'Light Gray', value: '#f5f5f0' },
  { name: 'Beige', value: '#f0e6d2' },
  { name: 'Soft Blue', value: '#f0f4f8' },
  { name: 'Lavender', value: '#f8f4f8' }
];

const RoomPreview: React.FC<RoomPreviewProps> = ({ artwork, onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(roomOptions[0]);
  const [frameSize, setFrameSize] = useState(100); // percentage
  const [framePosition, setFramePosition] = useState({ x: 50, y: 40 }); // percentage
  const [wallColor, setWallColor] = useState(selectedRoom.wallColor);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWallColor(selectedRoom.wallColor);
  }, [selectedRoom]);

  const handleMouseDown = (type: 'move' | 'resize') => {
    if (type === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isDragging) {
      setFramePosition({
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y))
      });
    } else if (isResizing) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width * framePosition.x / 100), 2) +
        Math.pow(e.clientY - (rect.top + rect.height * framePosition.y / 100), 2)
      );
      const newSize = Math.max(20, Math.min(150, (distance / Math.min(rect.width, rect.height)) * 100));
      setFrameSize(newSize);
    }
  };

  const handleRoomSelect = (room: RoomOption) => {
    setSelectedRoom(room);
    setFrameSize(100); // Reset size
    setFramePosition({ x: 50, y: 40 }); // Reset position
  };

  const resetView = () => {
    setFrameSize(100);
    setFramePosition({ x: 50, y: 40 });
    setWallColor(selectedRoom.wallColor);
  };

  return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <div className="flex items-center gap-3">
              <Paintbrush className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Room Preview</h2>
                <p className="text-sm text-gray-600">{artwork.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="text-gray-600 hover:text-gray-900"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
            {/* Main Preview Area */}
            <div className="flex-1 relative overflow-hidden bg-gray-100">
              <div 
                ref={containerRef}
                className="w-full h-full relative cursor-move"
                style={{
                  backgroundImage: `url(${selectedRoom.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: `brightness(0.85) contrast(1.05) saturate(0.9)`,
                  backgroundColor: wallColor,
                  backgroundBlendMode: 'overlay'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Artwork Overlay */}
                <div
                  ref={artworkRef}
                  className="absolute cursor-move"
                  style={{
                    left: `${framePosition.x}%`,
                    top: `${framePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${frameSize}%`,
                    maxWidth: '500px',
                    aspectRatio: '4/5'
                  }}
                >
                  <div className="relative w-full h-full shadow-2xl">
                    {/* Frame */}
                    <div className="luxury-artwork-frame luxury-frame-medium w-full h-full">
                      <div className="luxury-frame-outer">
                        <div className="luxury-frame-corner luxury-frame-corner-tl" />
                        <div className="luxury-frame-corner luxury-frame-corner-tr" />
                        <div className="luxury-frame-corner luxury-frame-corner-bl" />
                        <div className="luxury-frame-corner luxury-frame-corner-br" />
                        
                        <div className="luxury-frame-border luxury-frame-border-top" />
                        <div className="luxury-frame-border luxury-frame-border-right" />
                        <div className="luxury-frame-border luxury-frame-border-bottom" />
                        <div className="luxury-frame-border luxury-frame-border-left" />
                        
                        <div className="luxury-frame-inner">
                          <div className="luxury-frame-content">
                            <OptimizedImage
                              src={artwork.image_url}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="luxury-frame-shadow" />
                    </div>

                    {/* Resize Handle */}
                    <div
                      className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-600 rounded-full cursor-nwse-resize shadow-lg flex items-center justify-center hover:bg-amber-700 transition-colors"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown('resize');
                      }}
                    >
                      <Maximize2 className="w-3 h-3 text-white" />
                    </div>

                    {/* Move Handle */}
                    <div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Move className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Helpful Instructions */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <p className="text-sm text-gray-600">
                    <Move className="w-4 h-4 inline mr-1" />
                    Drag to move • 
                    <Maximize2 className="w-4 h-4 inline mx-1" />
                    Drag corner to resize
                  </p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Room Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Room Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {roomOptions.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedRoom.id === room.id
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-video rounded mb-2 overflow-hidden">
                          <OptimizedImage
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{room.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Size Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Frame Size</h3>
                    <span className="text-sm text-gray-600">{Math.round(frameSize)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, var(--luxury-gold) 0%, var(--luxury-gold) ${frameSize}%, #e5e7eb ${frameSize}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Wall Color Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Wall Color</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {wallColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setWallColor(color.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          wallColor === color.value
                            ? 'border-amber-600 ring-2 ring-amber-600 ring-offset-2'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        <div className="text-xs mt-1 text-gray-600">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Settings</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setFramePosition({ x: 50, y: 35 });
                        setFrameSize(120);
                      }}
                    >
                      Center, Large
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setFramePosition({ x: 35, y: 40 });
                        setFrameSize(90);
                      }}
                    >
                      Left Side, Medium
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setFramePosition({ x: 65, y: 40 });
                        setFrameSize(90);
                      }}
                    >
                      Right Side, Medium
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPreview;
