import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, Maximize2, Minimize2, Move, Paintbrush, Upload, Image, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
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
    name: 'Salon Moderne',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    wallColor: '#f5f5f5'
  },
  {
    id: 'bedroom',
    name: 'Chambre',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    wallColor: '#f8f6f0'
  },
  {
    id: 'office',
    name: 'Bureau',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    wallColor: '#f5f5f5'
  },
  {
    id: 'dining',
    name: 'Salle à Manger',
    image: 'https://images.unsplash.com/photo-1556912173-0a0227f7982e?w=800&q=80',
    wallColor: '#faf9f6'
  },
  {
    id: 'gallery',
    name: 'Galerie',
    image: 'https://images.unsplash.com/photo-1594736797933-d0e2d728ce48?w=800&q=80',
    wallColor: '#ffffff'
  },
  {
    id: 'entry',
    name: 'Entrée',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    wallColor: '#f8f8f8'
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
  const [frameSize, setFrameSize] = useState(70); // Reduced for better mobile display
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
    setFrameSize(70);
    setFramePosition({ x: 50, y: 40 });
    setRotation(0);
    setWallColor(useCustomRoom && customRoomImage ? '#f5f5f5' : selectedRoom.wallColor);
  };

  return (
      <div className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm" style={{ backgroundColor: 'rgba(43, 48, 46, 0.7)' }} onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] rounded-xl sm:rounded-lg shadow-2xl overflow-hidden flex flex-col border" style={{ 
          backgroundColor: '#F9F8F3', /* FROSTY WHITE */
          borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */
        }} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b" style={{ 
            backgroundColor: '#F9F8F3',
            borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
          }}>
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 shadow-lg" style={{ 
                  backgroundColor: '#873F31', /* PIPE */
                  borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */
                }}>
                  <Paintbrush className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#F9F8F3' }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-2xl font-medium truncate" style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}>
                  Room Preview
                </h2>
                <p className="text-xs sm:text-sm font-medium truncate" style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#717871' /* SAGE */
                }}>
                  {artwork.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetView}
                className="hidden sm:flex transition-all duration-300 rounded-lg border"
                style={{ 
                  color: '#717871',
                  borderColor: 'rgba(122, 119, 113, 0.3)',
                  fontFamily: "'Proza Libre', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(122, 119, 113, 0.08)';
                  e.currentTarget.style.borderColor = '#873F31';
                  e.currentTarget.style.color = '#873F31';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                  e.currentTarget.style.color = '#717871';
                }}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="transition-all duration-300 rounded-lg border"
                style={{ 
                  color: '#717871',
                  borderColor: 'rgba(122, 119, 113, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                  e.currentTarget.style.color = '#717871';
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Main Preview Area */}
            <div className="flex-1 relative overflow-hidden min-h-[200px] sm:min-h-[300px]" style={{ backgroundColor: wallColor }}>
              {/* Clean background with subtle pattern */}
              <div 
                ref={containerRef}
                className="w-full h-full relative"
                style={{
                  background: useCustomRoom && customRoomImage 
                    ? `url(${customRoomImage}) center/cover no-repeat, linear-gradient(${wallColor}, ${wallColor})`
                    : `url(${selectedRoom.image}) center/cover no-repeat, linear-gradient(${wallColor}dd, ${wallColor}dd)`,
                  backgroundBlendMode: 'overlay'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Artwork Overlay */}
                <div
                  ref={artworkRef}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${framePosition.x}%`,
                    top: `${framePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `min(${frameSize}%, ${window.innerWidth < 640 ? '90vw' : '500px'})`,
                    maxWidth: window.innerWidth < 640 ? '350px' : '500px',
                    minWidth: '120px',
                    aspectRatio: '4/5',
                    zIndex: 20,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))'
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
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full cursor-nwse-resize shadow-lg flex items-center justify-center border-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: '#873F31', /* PIPE */
                        borderColor: '#F9F8F3',
                        color: '#F9F8F3'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown('resize');
                      }}
                    >
                      <Maximize2 className="w-3 h-3" style={{ color: '#F9F8F3' }} />
                    </div>

                    {/* Move Handle */}
                    <div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Move className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Visual Indicator for Artwork Position on Mobile */}
                {!artworkRef.current && (
                  <div 
                    className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                  >
                    <div className="rounded-lg p-4 shadow-2xl border" style={{ 
                      backgroundColor: '#873F31', /* PIPE */
                      color: '#F9F8F3',
                      borderColor: 'rgba(122, 119, 113, 0.3)'
                    }}>
                      <p className="text-sm sm:text-base font-medium text-center flex items-center justify-center gap-2" style={{ 
                        fontFamily: "'Proza Libre', sans-serif"
                      }}>
                        <Paintbrush className="w-5 h-5" />
                        Your artwork appears here
                      </p>
                      <p className="text-xs mt-2 text-center opacity-90" style={{ 
                        fontFamily: "'Proza Libre', sans-serif"
                      }}>
                        Use sliders below to adjust size and position
                      </p>
                    </div>
                  </div>
                )}

                {/* Helpful Instructions */}
                {useCustomRoom && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-3 py-2 rounded-lg border shadow-lg" style={{ 
                    backgroundColor: '#873F31', /* PIPE */
                    color: '#F9F8F3',
                    borderColor: 'rgba(122, 119, 113, 0.3)'
                  }}>
                    <p className="text-xs sm:text-sm font-medium flex items-center gap-1" style={{ 
                      fontFamily: "'Proza Libre', sans-serif"
                    }}>
                      <Image className="w-4 h-4" />
                      Custom Room Active
                    </p>
                  </div>
                )}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg max-w-[90%] sm:max-w-none border" style={{ 
                  backgroundColor: 'rgba(249, 248, 243, 0.95)', /* FROSTY WHITE */
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <p className="text-xs sm:text-sm" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    <span className="hidden sm:inline"><Move className="w-4 h-4 inline mr-1" style={{ color: '#873F31' }} />Drag to move • </span>
                    <span className="hidden sm:inline"><Maximize2 className="w-4 h-4 inline mx-1" style={{ color: '#873F31' }} />Drag corner to resize</span>
                    <span className="sm:hidden">Tap controls to adjust</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l overflow-y-auto max-h-[50vh] lg:max-h-none" style={{ 
              backgroundColor: '#F9F8F3', /* FROSTY WHITE */
              borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
            }}>
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-6">
                {/* Room Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center border" style={{ 
                      backgroundColor: 'rgba(122, 119, 113, 0.08)', /* SAGE light */
                      borderColor: 'rgba(122, 119, 113, 0.3)'
                    }}>
                      <Image className="w-3.5 h-3.5" style={{ color: '#873F31' }} />
                    </div>
                    <h3 className="text-base font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      Room Type
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-[300px] overflow-y-auto">
                    {roomOptions.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedRoom.id === room.id && !useCustomRoom
                            ? 'shadow-md'
                            : 'hover:shadow-sm'
                        }`}
                        style={{
                          borderColor: selectedRoom.id === room.id && !useCustomRoom
                            ? '#873F31' /* PIPE */
                            : 'rgba(122, 119, 113, 0.2)', /* SAGE */
                          backgroundColor: selectedRoom.id === room.id && !useCustomRoom
                            ? 'rgba(135, 63, 49, 0.08)' /* PIPE light */
                            : '#F9F8F3' /* FROSTY WHITE */
                        }}
                      >
                        <div className="aspect-video rounded-lg mb-2 overflow-hidden border" style={{ 
                          borderColor: 'rgba(122, 119, 113, 0.15)',
                          backgroundColor: '#EBE2D1' /* PEACH CREAM */
                        }}>
                          <OptimizedImage
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium" style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: '#4B4A46' /* CHARCOAL TAUPE */
                        }}>
                          {room.name}
                        </p>
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
                      className="w-full border-2 transition-all duration-300 rounded-lg"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.3)',
                        backgroundColor: 'transparent',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#717871';
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your Room
                    </Button>
                    {useCustomRoom && (
                      <div className="mt-3 p-3 rounded-lg border shadow-sm" style={{ 
                        backgroundColor: 'rgba(34, 197, 94, 0.08)',
                        borderColor: '#22c55e'
                      }}>
                        <p className="text-xs font-medium flex items-center gap-1" style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: '#22c55e'
                        }}>
                          <span>✓</span> Custom room uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame Size Slider */}
                <div className="rounded-lg p-4 border shadow-sm" style={{ 
                  backgroundColor: '#F9F8F3',
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      Frame Size
                    </h3>
                    <span className="text-sm font-medium px-2 py-1 rounded-full border" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#873F31', /* PIPE */
                      backgroundColor: 'rgba(135, 63, 49, 0.08)',
                      borderColor: 'rgba(122, 119, 113, 0.2)'
                    }}>
                      {Math.round(frameSize)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #873F31 0%, #873F31 ${((frameSize - 50) / 100) * 100}%, rgba(122, 119, 113, 0.2) ${((frameSize - 50) / 100) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs font-medium mt-2" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Precise Position Controls */}
                <div className="rounded-lg p-4 border" style={{ 
                  backgroundColor: 'rgba(122, 119, 113, 0.04)', /* SAGE very light */
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <h3 className="text-sm font-medium mb-3" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Position
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs mb-2 block" style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#717871' /* SAGE */
                      }}>
                        Horizontal: {framePosition.x}%
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFramePosition(prev => ({ ...prev, x: Math.max(10, prev.x - 5) }))}
                          className="p-2 rounded-lg border-2 transition-all"
                          style={{ 
                            backgroundColor: '#F9F8F3',
                            borderColor: 'rgba(122, 119, 113, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#873F31';
                            e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                            e.currentTarget.style.backgroundColor = '#F9F8F3';
                          }}
                        >
                          <ArrowLeft className="w-4 h-4" style={{ color: '#873F31' }} />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={framePosition.x}
                          onChange={(e) => setFramePosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #873F31 0%, #873F31 ${((framePosition.x - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) ${((framePosition.x - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                          }}
                        />
                        <button
                          onClick={() => setFramePosition(prev => ({ ...prev, x: Math.min(90, prev.x + 5) }))}
                          className="p-2 rounded-lg border-2 transition-all"
                          style={{ 
                            backgroundColor: '#F9F8F3',
                            borderColor: 'rgba(122, 119, 113, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#873F31';
                            e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                            e.currentTarget.style.backgroundColor = '#F9F8F3';
                          }}
                        >
                          <ArrowRight className="w-4 h-4" style={{ color: '#873F31' }} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs mb-2 block" style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#717871' /* SAGE */
                      }}>
                        Vertical: {framePosition.y}%
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFramePosition(prev => ({ ...prev, y: Math.max(10, prev.y - 5) }))}
                          className="p-2 rounded-lg border-2 transition-all"
                          style={{ 
                            backgroundColor: '#F9F8F3',
                            borderColor: 'rgba(122, 119, 113, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#873F31';
                            e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                            e.currentTarget.style.backgroundColor = '#F9F8F3';
                          }}
                        >
                          <ArrowUp className="w-4 h-4" style={{ color: '#873F31' }} />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={framePosition.y}
                          onChange={(e) => setFramePosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #873F31 0%, #873F31 ${((framePosition.y - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) ${((framePosition.y - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                          }}
                        />
                        <button
                          onClick={() => setFramePosition(prev => ({ ...prev, y: Math.min(90, prev.y + 5) }))}
                          className="p-2 rounded-lg border-2 transition-all"
                          style={{ 
                            backgroundColor: '#F9F8F3',
                            borderColor: 'rgba(122, 119, 113, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#873F31';
                            e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.3)';
                            e.currentTarget.style.backgroundColor = '#F9F8F3';
                          }}
                        >
                          <ArrowDown className="w-4 h-4" style={{ color: '#873F31' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Size Controls */}
                <div className="rounded-lg p-4 border shadow-sm" style={{ 
                  backgroundColor: '#F9F8F3',
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <h3 className="text-sm font-medium mb-3" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Quick Size
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFrameSize(60)}
                      className="p-3 rounded-lg border-2 transition-all text-sm font-medium"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.2)',
                        backgroundColor: '#F9F8F3',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        e.currentTarget.style.backgroundColor = '#F9F8F3';
                        e.currentTarget.style.color = '#717871';
                      }}
                    >
                      <ZoomOut className="w-4 h-4 mx-auto mb-1" style={{ color: 'inherit' }} />
                      Small
                    </button>
                    <button
                      onClick={() => setFrameSize(80)}
                      className="p-3 rounded-lg border-2 text-sm font-medium shadow-md"
                      style={{ 
                        borderColor: '#873F31',
                        backgroundColor: 'rgba(135, 63, 49, 0.08)',
                        color: '#873F31',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                    >
                      <ZoomIn className="w-4 h-4 mx-auto mb-1" style={{ color: 'inherit' }} />
                      Medium
                    </button>
                    <button
                      onClick={() => setFrameSize(100)}
                      className="p-3 rounded-lg border-2 transition-all text-sm font-medium"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.2)',
                        backgroundColor: '#F9F8F3',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        e.currentTarget.style.backgroundColor = '#F9F8F3';
                        e.currentTarget.style.color = '#717871';
                      }}
                    >
                      <ZoomIn className="w-5 h-5 mx-auto mb-1" style={{ color: 'inherit' }} />
                      Large
                    </button>
                  </div>
                </div>

                {/* Rotation Slider */}
                <div className="rounded-lg p-4 border shadow-sm" style={{ 
                  backgroundColor: '#F9F8F3',
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      Rotation
                    </h3>
                    <span className="text-sm font-medium px-2 py-1 rounded-full border" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#873F31', /* PIPE */
                      backgroundColor: 'rgba(135, 63, 49, 0.08)',
                      borderColor: 'rgba(122, 119, 113, 0.2)'
                    }}>
                      {rotation}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #873F31 0%, #873F31 ${((rotation + 45) / 90) * 100}%, rgba(122, 119, 113, 0.2) ${((rotation + 45) / 90) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs font-medium mt-2" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    <span>-45°</span>
                    <span>0°</span>
                    <span>45°</span>
                  </div>
                </div>

                {/* Wall Color Selection */}
                <div className="rounded-lg p-4 border shadow-sm" style={{ 
                  backgroundColor: '#F9F8F3',
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <h3 className="text-sm font-medium mb-3" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Wall Color
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {wallColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setWallColor(color.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          wallColor === color.value
                            ? 'ring-2 ring-offset-2 shadow-lg ring-[#873F31]'
                            : 'hover:shadow-md'
                        }`}
                        style={{ 
                          backgroundColor: color.value,
                          borderColor: wallColor === color.value
                            ? '#873F31' /* PIPE */
                            : 'rgba(122, 119, 113, 0.2)' /* SAGE */
                        }}
                      >
                        <div className="text-xs mt-1 font-medium" style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: wallColor === color.value ? '#873F31' : '#4B4A46'
                        }}>
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="rounded-lg p-4 border" style={{ 
                  backgroundColor: 'rgba(122, 119, 113, 0.04)', /* SAGE very light */
                  borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
                }}>
                  <h3 className="text-sm font-medium mb-3" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Quick Settings
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 transition-all duration-300 rounded-lg"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.2)',
                        backgroundColor: '#F9F8F3',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        e.currentTarget.style.backgroundColor = '#F9F8F3';
                        e.currentTarget.style.color = '#717871';
                      }}
                      onClick={() => {
                        setFramePosition({ x: 50, y: 35 });
                        setFrameSize(120);
                      }}
                    >
                      Center, Large
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 transition-all duration-300 rounded-lg"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.2)',
                        backgroundColor: '#F9F8F3',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        e.currentTarget.style.backgroundColor = '#F9F8F3';
                        e.currentTarget.style.color = '#717871';
                      }}
                      onClick={() => {
                        setFramePosition({ x: 35, y: 40 });
                        setFrameSize(90);
                      }}
                    >
                      Left Side, Medium
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 transition-all duration-300 rounded-lg"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.2)',
                        backgroundColor: '#F9F8F3',
                        color: '#717871',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#873F31';
                        e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                        e.currentTarget.style.color = '#873F31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        e.currentTarget.style.backgroundColor = '#F9F8F3';
                        e.currentTarget.style.color = '#717871';
                      }}
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
