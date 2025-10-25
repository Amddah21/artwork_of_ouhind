import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, Maximize2, Minimize2, Move, Paintbrush, Upload, Image } from 'lucide-react';
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
  const [customRoomImage, setCustomRoomImage] = useState<string | null>(null);
  const [useCustomRoom, setUseCustomRoom] = useState(false);
  const [frameSize, setFrameSize] = useState(100); // percentage
  const [framePosition, setFramePosition] = useState({ x: 50, y: 40 }); // percentage
  const [rotation, setRotation] = useState(0); // degrees
  const [wallColor, setWallColor] = useState(selectedRoom.wallColor);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUseCustomRoom(false);
    setFrameSize(100); // Reset size
    setFramePosition({ x: 50, y: 40 }); // Reset position
    setRotation(0); // Reset rotation
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File too large. Please upload an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCustomRoomImage(result);
          setUseCustomRoom(true);
          setSelectedRoom({
            id: 'custom',
            name: 'Custom Room',
            image: result,
            wallColor: '#f5f5f5'
          });
          // Reset wall color for custom room
          setWallColor('#f5f5f5');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetView = () => {
    setFrameSize(100);
    setFramePosition({ x: 50, y: 40 });
    setRotation(0);
    setWallColor(useCustomRoom && customRoomImage ? '#f5f5f5' : selectedRoom.wallColor);
  };

  return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-xl sm:rounded-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200/30">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40"></div>
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                  <Paintbrush className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent truncate">
                  Room Preview
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{artwork.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="hidden sm:flex text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 rounded-lg"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
              >
                <X className="w-5 h-5" />
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
                  backgroundImage: `url(${useCustomRoom && customRoomImage ? customRoomImage : selectedRoom.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: useCustomRoom && customRoomImage 
                    ? `brightness(0.95) contrast(1.05) saturate(0.95)` 
                    : `brightness(0.85) contrast(1.05) saturate(0.9)`,
                  backgroundColor: wallColor,
                  backgroundBlendMode: useCustomRoom && customRoomImage ? 'normal' : 'overlay'
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
                  <div className="relative w-full h-full shadow-2xl" style={{ transform: `rotate(${rotation}deg)` }}>
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
                {useCustomRoom && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-xs sm:text-sm font-bold flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      Custom Room Active
                    </p>
                  </div>
                )}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg max-w-[90%] sm:max-w-none">
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="hidden sm:inline"><Move className="w-4 h-4 inline mr-1" />Drag to move • </span>
                    <span className="hidden sm:inline"><Maximize2 className="w-4 h-4 inline mx-1" />Drag corner to resize</span>
                    <span className="sm:hidden">Tap controls to adjust</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-80 bg-gradient-to-b from-amber-50/30 to-white border-t lg:border-t-0 lg:border-l border-amber-200/30 overflow-y-auto">
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                {/* Room Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Room Type</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {roomOptions.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedRoom.id === room.id && !useCustomRoom
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md shadow-amber-200/50'
                            : 'border-gray-200 hover:border-amber-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="aspect-video rounded-lg mb-2 overflow-hidden border border-gray-100 bg-gray-100">
                          <OptimizedImage
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{room.name}</p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Upload Custom Room */}
                  <div className="mt-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="room-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full border-2 border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50 text-amber-700 hover:text-amber-800 font-medium transition-all duration-200 rounded-xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your Room
                    </Button>
                    {useCustomRoom && (
                      <div className="mt-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl shadow-sm">
                        <p className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                          <span className="text-green-600">✓</span> Custom room uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame Size Slider */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Frame Size</h3>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{Math.round(frameSize)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${frameSize}%, #e5e7eb ${frameSize}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mt-2">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Rotation Slider */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Rotation</h3>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((rotation + 45) / 90) * 100}%, #e5e7eb ${((rotation + 45) / 90) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mt-2">
                    <span>-45°</span>
                    <span>0°</span>
                    <span>45°</span>
                  </div>
                </div>

                {/* Wall Color Selection */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Wall Color</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {wallColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setWallColor(color.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          wallColor === color.value
                            ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-2 shadow-lg'
                            : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        <div className="text-xs mt-1 font-semibold text-gray-700">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Settings</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50 transition-all duration-200 rounded-xl"
                      onClick={() => {
                        setFramePosition({ x: 50, y: 35 });
                        setFrameSize(120);
                      }}
                    >
                      Center, Large
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50 transition-all duration-200 rounded-xl"
                      onClick={() => {
                        setFramePosition({ x: 35, y: 40 });
                        setFrameSize(90);
                      }}
                    >
                      Left Side, Medium
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50 transition-all duration-200 rounded-xl"
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
