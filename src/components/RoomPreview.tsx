import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, RotateCw, Maximize2, Move, Paintbrush, Upload, Image, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
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

// High-resolution room images with proper aspect ratios
const roomOptions: RoomOption[] = [
  {
    id: 'living-room',
    name: 'Salon Moderne',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=90&fit=crop',
    wallColor: '#f5f5f5'
  },
  {
    id: 'bedroom',
    name: 'Chambre',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1920&q=90&fit=crop',
    wallColor: '#f8f6f0'
  },
  {
    id: 'office',
    name: 'Bureau',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=90&fit=crop',
    wallColor: '#f5f5f5'
  },
  {
    id: 'dining',
    name: 'Salle à Manger',
    image: 'https://images.unsplash.com/photo-1556912173-0a0227f7982e?w=1920&q=90&fit=crop',
    wallColor: '#faf9f6'
  },
  {
    id: 'gallery',
    name: 'Galerie',
    image: 'https://images.unsplash.com/photo-1594736797933-d0e2d728ce48?w=1920&q=90&fit=crop',
    wallColor: '#ffffff'
  },
  {
    id: 'entry',
    name: 'Entrée',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90&fit=crop',
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
  const [frameSize, setFrameSize] = useState(70);
  const [framePosition, setFramePosition] = useState({ x: 50, y: 45 });
  const [rotation, setRotation] = useState(0);
  const [wallColor, setWallColor] = useState(selectedRoom.wallColor);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, size: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate proper boundaries based on frame size
  const getBoundaries = useCallback(() => {
    if (!containerRef.current || !artworkRef.current) return { minX: 10, maxX: 90, minY: 10, maxY: 90 };
    
    const container = containerRef.current;
    const frame = artworkRef.current;
    const containerRect = container.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    
    // Calculate boundaries so frame doesn't go outside container
    const frameWidthPercent = (frameRect.width / containerRect.width) * 100;
    const frameHeightPercent = (frameRect.height / containerRect.height) * 100;
    
    const minX = frameWidthPercent / 2;
    const maxX = 100 - (frameWidthPercent / 2);
    const minY = frameHeightPercent / 2;
    const maxY = 100 - (frameHeightPercent / 2);
    
    return { minX, maxX, minY, maxY };
  }, []);

  // Handle mouse/touch start for dragging
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: clientX,
      y: clientY,
      offsetX: framePosition.x,
      offsetY: framePosition.y
    });
    setIsDragging(true);
  }, [framePosition]);

  // Handle mouse/touch start for resizing
  const handleResizeStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + (rect.width * framePosition.x / 100);
    const centerY = rect.top + (rect.height * framePosition.y / 100);
    const distance = Math.sqrt(
      Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
    );
    setResizeStart({
      x: clientX,
      y: clientY,
      size: frameSize
    });
    setIsResizing(true);
  }, [framePosition, frameSize]);

  // Handle mouse/touch move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    if (isDragging) {
      const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((clientY - dragStart.y) / rect.height) * 100;
      
      const boundaries = getBoundaries();
      const newX = Math.max(boundaries.minX, Math.min(boundaries.maxX, dragStart.offsetX + deltaX));
      const newY = Math.max(boundaries.minY, Math.min(boundaries.maxY, dragStart.offsetY + deltaY));
      
      setFramePosition({ x: newX, y: newY });
    } else if (isResizing) {
      const centerX = rect.left + (rect.width * framePosition.x / 100);
      const centerY = rect.top + (rect.height * framePosition.y / 100);
      const distance = Math.sqrt(
        Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
      );
      const scale = distance / Math.min(rect.width, rect.height);
      const newSize = Math.max(30, Math.min(120, resizeStart.size + (scale * 100)));
      setFrameSize(newSize);
    }
  }, [isDragging, isResizing, dragStart, resizeStart, framePosition, getBoundaries]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMove, handleEnd]);

  // Touch event handlers
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging || isResizing) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          handleMove(touch.clientX, touch.clientY);
        }
      }
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, handleMove, handleEnd]);

  useEffect(() => {
    setWallColor(selectedRoom.wallColor);
  }, [selectedRoom]);

  const handleRoomSelect = (room: RoomOption) => {
    setSelectedRoom(room);
    setUseCustomRoom(false);
    setFrameSize(70);
    setFramePosition({ x: 50, y: 45 });
    setRotation(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
          setWallColor('#f5f5f5');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetView = () => {
    setFrameSize(70);
    setFramePosition({ x: 50, y: 45 });
    setRotation(0);
    setWallColor(useCustomRoom && customRoomImage ? '#f5f5f5' : selectedRoom.wallColor);
  };

  // Calculate frame dimensions responsively with mobile constraints
  const calculateFrameSize = () => {
    if (!containerRef.current) return { width: '300px', maxWidth: '500px', maxHeight: 'none' };
    
    const container = containerRef.current.getBoundingClientRect();
    const containerWidth = container.width;
    const containerHeight = container.height;
    const isSmallMobile = containerWidth <= 420;
    const isMobile = containerWidth < 640;
    const isTablet = containerWidth >= 640 && container.width < 1024;
    
    // On small screens (<=420px), use strict constraints
    if (isSmallMobile) {
      const safeAreaPadding = 32; // 16px on each side
      const maxWidthCalc = `calc(100% - ${safeAreaPadding}px)`;
      const maxHeightValue = Math.min(containerHeight * 0.6, window.innerHeight * 0.6);
      
      return {
        width: `min(${maxWidthCalc}, ${(containerWidth - safeAreaPadding) * (frameSize / 100)}px)`,
        maxWidth: maxWidthCalc,
        maxHeight: `${maxHeightValue}px`,
        minWidth: '120px'
      };
    }
    
    // Regular mobile
    const baseWidth = containerWidth * (frameSize / 100);
    const maxWidth = isMobile ? 'calc(100% - 32px)' : isTablet ? '400px' : '500px';
    const minWidth = isMobile ? '120px' : '150px';
    
    return {
      width: `clamp(${minWidth}, ${baseWidth}px, ${maxWidth})`,
      maxWidth,
      maxHeight: isMobile ? '60vh' : 'none',
      minWidth
    };
  };

  // Recalculate frame dimensions when window width or frame size changes
  const frameDimensions = useMemo(() => calculateFrameSize(), [frameSize, windowWidth]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm" 
      style={{ backgroundColor: 'rgba(43, 48, 46, 0.75)' }} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6" 
        style={{
          paddingLeft: 'max(8px, env(safe-area-inset-left))',
          paddingRight: 'max(8px, env(safe-area-inset-right))',
          paddingTop: 'max(8px, env(safe-area-inset-top))',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full max-w-[1920px] h-[95vh] sm:h-[90vh] lg:h-[85vh] rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col border" 
          style={{ 
            backgroundColor: '#F9F8F3',
            borderColor: 'rgba(122, 119, 113, 0.3)',
            maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px)'
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b flex-shrink-0" 
            style={{ 
              backgroundColor: '#F9F8F3',
              borderColor: 'rgba(122, 119, 113, 0.2)'
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div 
                  className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 shadow-lg" 
                  style={{ 
                    backgroundColor: '#873F31',
                    borderColor: 'rgba(122, 119, 113, 0.3)'
                  }}
                >
                  <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: '#F9F8F3' }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 
                  className="text-base sm:text-xl lg:text-2xl font-medium truncate" 
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#4B4A46'
                  }}
                >
                  Room Preview
                </h2>
                <p 
                  className="text-xs sm:text-sm truncate" 
                  style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871'
                  }}
                >
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
                <span className="hidden lg:inline">Reset View</span>
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

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
            {/* Main Preview Area */}
            <div 
              className="flex-1 relative overflow-hidden min-h-[200px] sm:min-h-[250px] md:min-h-[350px] lg:min-h-[400px]" 
              style={{ 
                backgroundColor: wallColor,
                padding: 'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-right))'
              }}
            >
              {/* High-resolution background image */}
              <div 
                ref={containerRef}
                className="w-full h-full relative"
                style={{
                  backgroundImage: useCustomRoom && customRoomImage 
                    ? `url(${customRoomImage})` 
                    : `url(${selectedRoom.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  imageRendering: 'high-quality',
                  padding: windowWidth <= 420 ? '16px' : '0'
                }}
              >
                {/* Artwork Frame - Always proportional with mobile constraints */}
                <div
                  ref={artworkRef}
                  className="absolute select-none"
                  style={{
                    left: `${framePosition.x}%`,
                    top: `${framePosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    width: frameDimensions.width,
                    maxWidth: frameDimensions.maxWidth,
                    maxHeight: frameDimensions.maxHeight || 'none',
                    minWidth: frameDimensions.minWidth || '150px',
                    aspectRatio: '4/5',
                    zIndex: 20,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                    transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease-out',
                    cursor: windowWidth > 640 ? 'move' : 'default',
                    touchAction: 'none',
                    // Ensure frame never exceeds container
                    ...(windowWidth <= 420 && {
                      maxWidth: 'calc(100% - 32px)',
                      maxHeight: '60vh'
                    })
                  }}
                  onMouseDown={(e) => {
                    if (windowWidth > 640) {
                      if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.luxury-frame-outer')) {
                        e.preventDefault();
                        handleDragStart(e.clientX, e.clientY);
                      }
                    }
                  }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    if (touch) {
                      e.preventDefault();
                      handleDragStart(touch.clientX, touch.clientY);
                    }
                  }}
                >
                  <div className="relative w-full h-full">
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
                          <div className="luxury-frame-content" style={{ 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <OptimizedImage
                              src={artwork.image_url}
                              alt={artwork.title}
                              className="w-full h-full"
                              style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto'
                              }}
                              priority={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="luxury-frame-shadow" />
                    </div>

                    {/* Resize Handle - Hidden on small mobile, simplified on larger mobile */}
                    {windowWidth > 360 && (
                      <div
                        className={`absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 rounded-full shadow-xl flex items-center justify-center border-2 transition-all duration-300 z-30 ${
                          windowWidth <= 420 ? 'w-7 h-7' : 'w-8 h-8 sm:w-10 sm:h-10'
                        } ${windowWidth > 640 ? 'cursor-nwse-resize' : ''}`}
                        style={{ 
                          backgroundColor: '#873F31',
                          borderColor: '#F9F8F3',
                          color: '#F9F8F3',
                          touchAction: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (windowWidth > 640) {
                            e.currentTarget.style.transform = 'scale(1.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (windowWidth > 640) {
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                        onMouseDown={(e) => {
                          if (windowWidth > 640) {
                            e.stopPropagation();
                            e.preventDefault();
                            handleResizeStart(e.clientX, e.clientY);
                          }
                        }}
                        onTouchStart={(e) => {
                          const touch = e.touches[0];
                          if (touch) {
                            e.stopPropagation();
                            e.preventDefault();
                            handleResizeStart(touch.clientX, touch.clientY);
                          }
                        }}
                      >
                        <Maximize2 className={`${windowWidth <= 420 ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-5 sm:h-5'}`} style={{ color: '#F9F8F3' }} />
                      </div>
                    )}

                    {/* Drag Indicator - Hidden on small mobile */}
                    {windowWidth > 420 && (
                      <div
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full opacity-0 pointer-events-none transition-opacity duration-300"
                        style={{
                          opacity: isDragging ? 1 : 0
                        }}
                      >
                        <Move className="w-4 h-4 text-white inline mr-2" />
                        <span className="text-white text-xs font-medium" style={{ fontFamily: "'Proza Libre', sans-serif" }}>
                          Dragging
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Helpful Instructions - Simplified on mobile */}
                {windowWidth > 360 && (
                  <div 
                    className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 md:p-3 shadow-lg border z-10 max-w-[85%] sm:max-w-none" 
                    style={{ 
                      backgroundColor: 'rgba(249, 248, 243, 0.95)',
                      borderColor: 'rgba(122, 119, 113, 0.2)',
                      fontSize: windowWidth <= 420 ? '0.65rem' : 'inherit'
                    }}
                  >
                    <p 
                      className={`${windowWidth <= 420 ? 'text-xs' : 'text-xs sm:text-sm'} flex items-center gap-1`}
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#717871'
                      }}
                    >
                      {windowWidth > 640 && (
                        <>
                          <Move className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" style={{ color: '#873F31' }} />
                          <span>Drag to move • </span>
                          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mx-0.5 sm:mx-1" style={{ color: '#873F31' }} />
                          <span>Corner to resize</span>
                        </>
                      )}
                      {windowWidth <= 640 && windowWidth > 360 && (
                        <span>Use sliders below</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel */}
            <div 
              className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l overflow-y-auto flex-shrink-0" 
              style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)',
                maxHeight: windowWidth <= 420 ? 'calc(100vh - 60vh - 120px)' : windowWidth < 640 ? '45vh' : '50vh',
                minHeight: windowWidth <= 420 ? '200px' : '250px',
                paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
              }}
            >
              <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Room Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div 
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border flex-shrink-0" 
                      style={{ 
                        backgroundColor: 'rgba(122, 119, 113, 0.08)',
                        borderColor: 'rgba(122, 119, 113, 0.3)'
                      }}
                    >
                      <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#873F31' }} />
                    </div>
                    <h3 
                      className="text-sm sm:text-base font-medium" 
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#4B4A46'
                      }}
                    >
                      Room Type
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto pr-1">
                    {roomOptions.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedRoom.id === room.id && !useCustomRoom
                            ? 'shadow-md'
                            : 'hover:shadow-sm'
                        }`}
                        style={{
                          borderColor: selectedRoom.id === room.id && !useCustomRoom
                            ? '#873F31'
                            : 'rgba(122, 119, 113, 0.2)',
                          backgroundColor: selectedRoom.id === room.id && !useCustomRoom
                            ? 'rgba(135, 63, 49, 0.08)'
                            : '#F9F8F3'
                        }}
                      >
                        <div 
                          className="aspect-video rounded-lg mb-2 overflow-hidden border" 
                          style={{ 
                            borderColor: 'rgba(122, 119, 113, 0.15)',
                            backgroundColor: '#EBE2D1'
                          }}
                        >
                          <OptimizedImage
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                            priority={false}
                          />
                        </div>
                        <p 
                          className="text-xs sm:text-sm font-medium text-center" 
                          style={{ 
                            fontFamily: "'Proza Libre', sans-serif",
                            color: '#4B4A46'
                          }}
                        >
                          {room.name}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Upload Custom Room */}
                  <div className="mt-3 sm:mt-4">
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
                      <div 
                        className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-lg border shadow-sm" 
                        style={{ 
                          backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          borderColor: '#22c55e'
                        }}
                      >
                        <p 
                          className="text-xs font-medium flex items-center gap-1.5" 
                          style={{ 
                            fontFamily: "'Proza Libre', sans-serif",
                            color: '#22c55e'
                          }}
                        >
                          <span>✓</span> Custom room uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame Size Slider */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border shadow-sm" 
                  style={{ 
                    backgroundColor: '#F9F8F3',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 
                      className="text-xs sm:text-sm font-medium" 
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#4B4A46'
                      }}
                    >
                      Frame Size
                    </h3>
                    <span 
                      className="text-xs sm:text-sm font-medium px-2 py-1 rounded-full border" 
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#873F31',
                        backgroundColor: 'rgba(135, 63, 49, 0.08)',
                        borderColor: 'rgba(122, 119, 113, 0.2)'
                      }}
                    >
                      {Math.round(frameSize)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="1"
                    value={frameSize}
                    onChange={(e) => setFrameSize(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #873F31 0%, #873F31 ${((frameSize - 30) / 90) * 100}%, rgba(122, 119, 113, 0.2) ${((frameSize - 30) / 90) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                    }}
                  />
                  <div 
                    className="flex justify-between text-xs font-medium mt-2" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871'
                    }}
                  >
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Position Controls */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border" 
                  style={{ 
                    backgroundColor: 'rgba(122, 119, 113, 0.04)',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <h3 
                    className="text-xs sm:text-sm font-medium mb-3" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46'
                    }}
                  >
                    Position
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label 
                        className="text-xs mb-2 block" 
                        style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: '#717871'
                        }}
                      >
                        Horizontal: {Math.round(framePosition.x)}%
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const boundaries = getBoundaries();
                            setFramePosition(prev => ({ ...prev, x: Math.max(boundaries.minX, prev.x - 5) }));
                          }}
                          className="p-1.5 sm:p-2 rounded-lg border-2 transition-all flex-shrink-0"
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
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#873F31' }} />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          step="1"
                          value={framePosition.x}
                          onChange={(e) => {
                            const boundaries = getBoundaries();
                            const value = Number(e.target.value);
                            const clampedValue = Math.max(boundaries.minX, Math.min(boundaries.maxX, value));
                            setFramePosition(prev => ({ ...prev, x: clampedValue }));
                          }}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #873F31 0%, #873F31 ${((framePosition.x - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) ${((framePosition.x - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                          }}
                        />
                        <button
                          onClick={() => {
                            const boundaries = getBoundaries();
                            setFramePosition(prev => ({ ...prev, x: Math.min(boundaries.maxX, prev.x + 5) }));
                          }}
                          className="p-1.5 sm:p-2 rounded-lg border-2 transition-all flex-shrink-0"
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
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#873F31' }} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label 
                        className="text-xs mb-2 block" 
                        style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: '#717871'
                        }}
                      >
                        Vertical: {Math.round(framePosition.y)}%
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const boundaries = getBoundaries();
                            setFramePosition(prev => ({ ...prev, y: Math.max(boundaries.minY, prev.y - 5) }));
                          }}
                          className="p-1.5 sm:p-2 rounded-lg border-2 transition-all flex-shrink-0"
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
                          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#873F31' }} />
                        </button>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          step="1"
                          value={framePosition.y}
                          onChange={(e) => {
                            const boundaries = getBoundaries();
                            const value = Number(e.target.value);
                            const clampedValue = Math.max(boundaries.minY, Math.min(boundaries.maxY, value));
                            setFramePosition(prev => ({ ...prev, y: clampedValue }));
                          }}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #873F31 0%, #873F31 ${((framePosition.y - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) ${((framePosition.y - 10) / 80) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                          }}
                        />
                        <button
                          onClick={() => {
                            const boundaries = getBoundaries();
                            setFramePosition(prev => ({ ...prev, y: Math.min(boundaries.maxY, prev.y + 5) }));
                          }}
                          className="p-1.5 sm:p-2 rounded-lg border-2 transition-all flex-shrink-0"
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
                          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#873F31' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Size Controls */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border shadow-sm" 
                  style={{ 
                    backgroundColor: '#F9F8F3',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <h3 
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-3" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46'
                    }}
                  >
                    Quick Size
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { size: 50, label: 'Small', icon: ZoomOut },
                      { size: 70, label: 'Medium', icon: ZoomIn },
                      { size: 100, label: 'Large', icon: ZoomIn }
                    ].map(({ size, label, icon: Icon }, index) => (
                      <button
                        key={label}
                        onClick={() => setFrameSize(size)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium ${
                          frameSize >= size - 5 && frameSize <= size + 5 ? 'shadow-md' : ''
                        }`}
                        style={{ 
                          borderColor: frameSize >= size - 5 && frameSize <= size + 5 
                            ? '#873F31' 
                            : 'rgba(122, 119, 113, 0.2)',
                          backgroundColor: frameSize >= size - 5 && frameSize <= size + 5
                            ? 'rgba(135, 63, 49, 0.08)'
                            : '#F9F8F3',
                          color: frameSize >= size - 5 && frameSize <= size + 5 ? '#873F31' : '#717871',
                          fontFamily: "'Proza Libre', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                          if (!(frameSize >= size - 5 && frameSize <= size + 5)) {
                            e.currentTarget.style.borderColor = '#873F31';
                            e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.08)';
                            e.currentTarget.style.color = '#873F31';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!(frameSize >= size - 5 && frameSize <= size + 5)) {
                            e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                            e.currentTarget.style.backgroundColor = '#F9F8F3';
                            e.currentTarget.style.color = '#717871';
                          }
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1" style={{ color: 'inherit' }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation Slider */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border shadow-sm" 
                  style={{ 
                    backgroundColor: '#F9F8F3',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 
                      className="text-xs sm:text-sm font-medium" 
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#4B4A46'
                      }}
                    >
                      Rotation
                    </h3>
                    <span 
                      className="text-xs sm:text-sm font-medium px-2 py-1 rounded-full border" 
                      style={{ 
                        fontFamily: "'Proza Libre', sans-serif",
                        color: '#873F31',
                        backgroundColor: 'rgba(135, 63, 49, 0.08)',
                        borderColor: 'rgba(122, 119, 113, 0.2)'
                      }}
                    >
                      {rotation}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #873F31 0%, #873F31 ${((rotation + 45) / 90) * 100}%, rgba(122, 119, 113, 0.2) ${((rotation + 45) / 90) * 100}%, rgba(122, 119, 113, 0.2) 100%)`
                    }}
                  />
                  <div 
                    className="flex justify-between text-xs font-medium mt-2" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871'
                    }}
                  >
                    <span>-45°</span>
                    <span>0°</span>
                    <span>45°</span>
                  </div>
                </div>

                {/* Wall Color Selection */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border shadow-sm" 
                  style={{ 
                    backgroundColor: '#F9F8F3',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <h3 
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-3" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46'
                    }}
                  >
                    Wall Color
                  </h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {wallColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setWallColor(color.value)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                          wallColor === color.value
                            ? 'ring-2 ring-offset-2 shadow-lg ring-[#873F31]'
                            : 'hover:shadow-md'
                        }`}
                        style={{ 
                          backgroundColor: color.value,
                          borderColor: wallColor === color.value
                            ? '#873F31'
                            : 'rgba(122, 119, 113, 0.2)'
                        }}
                      >
                        <div 
                          className="text-xs mt-1 font-medium text-center" 
                          style={{ 
                            fontFamily: "'Proza Libre', sans-serif",
                            color: wallColor === color.value ? '#873F31' : '#4B4A46'
                          }}
                        >
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div 
                  className="rounded-lg p-3 sm:p-4 border" 
                  style={{ 
                    backgroundColor: 'rgba(122, 119, 113, 0.04)',
                    borderColor: 'rgba(122, 119, 113, 0.2)'
                  }}
                >
                  <h3 
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-3" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46'
                    }}
                  >
                    Quick Settings
                  </h3>
                  <div className="space-y-2">
                    {[
                      { x: 50, y: 40, size: 90, label: 'Center, Large' },
                      { x: 35, y: 45, size: 75, label: 'Left Side, Medium' },
                      { x: 65, y: 45, size: 75, label: 'Right Side, Medium' }
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        className="w-full justify-start border-2 transition-all duration-300 rounded-lg text-xs sm:text-sm"
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
                          setFramePosition({ x: preset.x, y: preset.y });
                          setFrameSize(preset.size);
                        }}
                      >
                        {preset.label}
                      </Button>
                    ))}
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