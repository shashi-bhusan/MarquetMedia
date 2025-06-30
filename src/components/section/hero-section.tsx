'use client';

import { useEffect, useState, useRef } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 280, height: 120 });
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState('');
  const [rotation, setRotation] = useState(-5); // Initial slight tilt added
  const [isActive, setIsActive] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const reshapeRef = useRef<HTMLSpanElement>(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, continue without video
      });
    }

    return () => {
      clearTimeout(timer);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, action: 'resize' | 'drag' | 'rotate', direction = '') => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsActive(true);
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { ...containerSize };
    initialPos.current = { ...containerPosition };
    
    // Add class to body for better cursor handling during resize/drag operations
    document.body.style.userSelect = 'none';
    document.body.style.cursor = action === 'drag' ? 'grabbing' : 
                                 action === 'rotate' ? 'alias' : 
                                 `${direction}-resize`;
    
    if (action === 'resize') {
      setIsResizing(true);
      setResizeDirection(direction);
      
      const handleResize = (e: MouseEvent) => {
        // Store the event values to avoid layout thrashing
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const initialX = initialMousePos.current.x;
        const initialY = initialMousePos.current.y;
        
        // Cancel any existing animation frame
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
        }
        
        // Use requestAnimationFrame for smooth animation without acceleration
        rafId.current = requestAnimationFrame(() => {
          const deltaX = mouseX - initialX;
          const deltaY = mouseY - initialY;
          
          let newWidth = initialSize.current.width;
          let newHeight = initialSize.current.height;
          let newX = initialPos.current.x;
          let newY = initialPos.current.y;
          
          const minWidth = 150;
          const minHeight = 60;
          
          // Improved resize behavior - more reliable and industry-standard
          // Maintains aspect ratio when shift is pressed
          const maintainAspectRatio = e.shiftKey;
          const aspectRatio = maintainAspectRatio ? initialSize.current.width / initialSize.current.height : null;
          
          switch(direction) {
            case 'se': // Southeast - bottom right
              newWidth = Math.max(minWidth, initialSize.current.width + deltaX);
              newHeight = Math.max(minHeight, initialSize.current.height + deltaY);
              if (maintainAspectRatio && aspectRatio) {
                // Keep aspect ratio by adjusting either width or height based on which one changed more
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  newHeight = newWidth / aspectRatio;
                } else {
                  newWidth = newHeight * aspectRatio;
                }
              }
              break;
            case 'sw': // Southwest - bottom left
              newWidth = Math.max(minWidth, initialSize.current.width - deltaX);
              newHeight = Math.max(minHeight, initialSize.current.height + deltaY);
              if (maintainAspectRatio && aspectRatio) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  newHeight = newWidth / aspectRatio;
                } else {
                  newWidth = newHeight * aspectRatio;
                }
              }
              if (newWidth > minWidth) {
                newX = initialPos.current.x + deltaX;
              }
              break;
            case 'ne': // Northeast - top right
              newWidth = Math.max(minWidth, initialSize.current.width + deltaX);
              newHeight = Math.max(minHeight, initialSize.current.height - deltaY);
              if (maintainAspectRatio && aspectRatio) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  newHeight = newWidth / aspectRatio;
                } else {
                  newWidth = newHeight * aspectRatio;
                }
              }
              if (newHeight > minHeight) {
                newY = initialPos.current.y + deltaY;
              }
              break;
            case 'nw': // Northwest - top left
              newWidth = Math.max(minWidth, initialSize.current.width - deltaX);
              newHeight = Math.max(minHeight, initialSize.current.height - deltaY);
              if (maintainAspectRatio && aspectRatio) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                  newHeight = newWidth / aspectRatio;
                } else {
                  newWidth = newHeight * aspectRatio;
                }
              }
              if (newWidth > minWidth) {
                newX = initialPos.current.x + deltaX;
              }
              if (newHeight > minHeight) {
                newY = initialPos.current.y + deltaY;
              }
              break;
            case 'n': // North - top
              newHeight = Math.max(minHeight, initialSize.current.height - deltaY);
              if (maintainAspectRatio && aspectRatio) {
                newWidth = newHeight * aspectRatio;
                // Adjust x to keep centered
                newX = initialPos.current.x - (newWidth - initialSize.current.width) / 2;
              }
              if (newHeight > minHeight) {
                newY = initialPos.current.y + deltaY;
              }
              break;
            case 's': // South - bottom
              newHeight = Math.max(minHeight, initialSize.current.height + deltaY);
              if (maintainAspectRatio && aspectRatio) {
                newWidth = newHeight * aspectRatio;
                // Adjust x to keep centered
                newX = initialPos.current.x - (newWidth - initialSize.current.width) / 2;
              }
              break;
            case 'e': // East - right
              newWidth = Math.max(minWidth, initialSize.current.width + deltaX);
              if (maintainAspectRatio && aspectRatio) {
                newHeight = newWidth / aspectRatio;
                // Adjust y to keep centered
                newY = initialPos.current.y - (newHeight - initialSize.current.height) / 2;
              }
              break;
            case 'w': // West - left
              newWidth = Math.max(minWidth, initialSize.current.width - deltaX);
              if (maintainAspectRatio && aspectRatio) {
                newHeight = newWidth / aspectRatio;
                // Adjust y to keep centered
                newY = initialPos.current.y - (newHeight - initialSize.current.height) / 2;
              }
              if (newWidth > minWidth) {
                newX = initialPos.current.x + deltaX;
              }
              break;
          }
          
          // Apply changes directly to the DOM element for smooth resizing
          if (reshapeRef.current) {
            reshapeRef.current.style.width = `${newWidth}px`;
            reshapeRef.current.style.height = `${newHeight}px`;
            reshapeRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) rotate(${rotation}deg)`;
          }
        });
      };
      
      const handleMouseUp = () => {
        // When mouse up, update the React state with the final position and size
        if (reshapeRef.current) {
          const width = parseInt(reshapeRef.current.style.width);
          const height = parseInt(reshapeRef.current.style.height);
          const transformStyle = reshapeRef.current.style.transform;
          
          // Extract translation values from the transform style
          const translateMatch = transformStyle.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
          if (translateMatch) {
            const x = parseFloat(translateMatch[1]);
            const y = parseFloat(translateMatch[2]);
            
            setContainerSize({ width, height });
            setContainerPosition({ x, y });
          }
        }
        
        setIsResizing(false);
        setIsActive(false);
        
        // Reset body styles
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleMouseUp);
      
    } else if (action === 'rotate') {
      const rect = reshapeRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const startAngle = Math.atan2(initialMousePos.current.y - centerY, initialMousePos.current.x - centerX);
        
        const handleRotateMove = (e: MouseEvent) => {
          // Cancel any existing animation frame
          if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
          }
          
          // Use requestAnimationFrame for smooth rotation without acceleration
          rafId.current = requestAnimationFrame(() => {
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const deltaAngle = (currentAngle - startAngle) * 180 / Math.PI;
            // Calculate new rotation directly from the initial rotation plus delta
            const newRotation = rotation + deltaAngle;
            
            // Apply changes directly to the DOM element
            if (reshapeRef.current) {
              reshapeRef.current.style.transform = `translate3d(${containerPosition.x}px, ${containerPosition.y}px, 0) rotate(${newRotation}deg)`;
            }
          });
        };

        const handleRotateUp = () => {
          // Update React state with final rotation value
          if (reshapeRef.current) {
            const transformStyle = reshapeRef.current.style.transform;
            const rotateMatch = transformStyle.match(/rotate\(([^)]+)deg\)/);
            if (rotateMatch) {
              const newRotation = parseFloat(rotateMatch[1]);
              setRotation(newRotation);
            }
          }
          
          setIsActive(false);
          
          // Reset body styles
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          
          if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
          }
          
          document.removeEventListener('mousemove', handleRotateMove);
          document.removeEventListener('mouseup', handleRotateUp);
        };

        document.addEventListener('mousemove', handleRotateMove);
        document.addEventListener('mouseup', handleRotateUp);
      }
    } else if (action === 'drag') {
      setIsDragging(true);
      
      // Add a black shadow effect to indicate active dragging
      if (reshapeRef.current) {
        reshapeRef.current.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.9), 0 3px 10px rgba(0, 0, 0, 0.3)';
        reshapeRef.current.style.borderColor = '#000';
      }
      
      const handleDrag = (e: MouseEvent) => {
        // Cancel any existing animation frame
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
        }
        
        // Use requestAnimationFrame for smooth dragging without acceleration
        rafId.current = requestAnimationFrame(() => {
          const deltaX = e.clientX - initialMousePos.current.x;
          const deltaY = e.clientY - initialMousePos.current.y;
          
          // Calculate new position directly from initial position
          const newX = initialPos.current.x + deltaX;
          const newY = initialPos.current.y + deltaY;
          
          // Apply changes directly to the DOM element
          if (reshapeRef.current) {
            reshapeRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) rotate(${rotation}deg)`;
          }
        });
      };
      
      const handleMouseUp = () => {
        // When mouse up, update the React state with the final position
        if (reshapeRef.current) {
          const transformStyle = reshapeRef.current.style.transform;
          const translateMatch = transformStyle.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
          if (translateMatch) {
            const x = parseFloat(translateMatch[1]);
            const y = parseFloat(translateMatch[2]);
            setContainerPosition({ x, y });
          }
          
          // Remove the highlight effect
          reshapeRef.current.style.boxShadow = '';
        }
        
        setIsDragging(false);
        setIsActive(false);
        
        // Reset body styles
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <>
      {/* Hero Text Section */}
      <section id="home" className="relative overflow-hidden h-[70vh] bg-cream">
        
        {/* Main Layout Container */}
        <div className="relative h-full flex items-center justify-center py-16 md:py-20">
          
          {/* Main Content - Minimal and Clean */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 max-w-6xl">
            
            {/* Primary Headline - Based on Screenshot */}
            <header className={`font-md text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <span className="leading-[1.15] text-foreground mx-auto">
                <div className="flex flex-row justify-center items-end w-full mb-6 md:mb-8 max-w-5xl mx-auto">
                  <span className="font-sans font-medium text-xl md:text-3xl lg:text-5xl xl:text-7xl whitespace-nowrap">WE </span>
                  
                  {/* Resizable Reshape Container */}
                  <span 
                    ref={reshapeRef}
                    className={`relative font-baskerville italic font-thin tracking-tighter mx-4 px-2 py-0 text-xl md:text-3xl lg:text-5xl xl:text-7xl whitespace-nowrap border border-black inline-block group select-none ${isActive ? 'shadow-md' : ''}`}
                    style={{
                      width: `${containerSize.width}px`,
                      height: `${containerSize.height}px`,
                      minWidth: '150px',
                      minHeight: '60px',
                      cursor: isDragging ? 'grabbing' : 'move',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      userSelect: 'none',
                      fontSize: `${Math.min(containerSize.width / 5, containerSize.height / 1.5, 72)}px`,
                      borderWidth: '1px',
                      boxSizing: 'border-box',
                      borderColor: '#000',
                      // Fix for crisp border rendering
                      transform: `translate3d(${containerPosition.x}px, ${containerPosition.y}px, 0) rotate(${rotation}deg)`,
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'subpixel-antialiased'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'drag')}
                  >
                    {/* Corner Resize Handles - Pure black without borders */}
                    {(['nw', 'ne', 'sw', 'se'] as const).map((direction) => {
                      const positions: Record<typeof direction, string> = {
                        nw: '-top-1.5 -left-1.5 cursor-nw-resize',
                        ne: '-top-1.5 -right-1.5 cursor-ne-resize', 
                        sw: '-bottom-1.5 -left-1.5 cursor-sw-resize',
                        se: '-bottom-1.5 -right-1.5 cursor-se-resize'
                      };
                      
                      return (
                        <div 
                          key={direction}
                          className={`absolute w-3 h-3 bg-black z-20 ${positions[direction]} ${isActive ? 'scale-110' : ''}`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown(e, 'resize', direction);
                          }}
                        ></div>
                      );
                    })}
                    
                    {/* Side Resize Handles - Pure black without borders */}
                    {(['n', 's', 'e', 'w'] as const).map((direction) => {
                      const positions: Record<typeof direction, string> = {
                        n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-4 h-2 cursor-n-resize',
                        s: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 w-4 h-2 cursor-s-resize',
                        e: 'right-0 top-1/2 translate-x-1.5 -translate-y-1/2 w-2 h-4 cursor-e-resize',
                        w: 'left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-2 h-4 cursor-w-resize'
                      };
                      
                      return (
                        <div 
                          key={direction}
                          className={`absolute bg-black z-20 transform ${positions[direction]} ${isActive ? 'scale-110' : ''}`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown(e, 'resize', direction);
                          }}
                        ></div>
                      );
                    })}

                    {/* Rotation Handle - Black dot with white border */}
                    <div 
                      className={`absolute -top-7 left-1/2 transform -translate-x-1/2 w-1 h-7 cursor-alias z-20 ${isActive ? 'scale-110' : ''}`}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, 'rotate');
                      }}
                    >
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-7 bg-black"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black border border-white rounded-full"></div>
                    </div>

                    {/* Content - Reshape Text */}
                    <span className="relative z-10 pointer-events-none select-none overflow-visible leading-[0.9] w-full px-0 flex justify-center items-center h-full">
                      reshape
                    </span>

                    {/* Selection info box - More visible with larger SVG */}
                    <div className={`absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs px-2 py-1 border border-black flex items-center space-x-2 z-30 whitespace-nowrap shadow-sm ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mr-1">
                        <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="3" y="3" width="6" height="6" fill="currentColor"/>
                      </svg>
                      <span className="tabular-nums font-medium">{Math.round(containerSize.width)}×{Math.round(containerSize.height)}</span>
                      {Math.abs(rotation) > 1 && <span className="tabular-nums font-medium">{Math.round(rotation)}°</span>}
                    </div>
                  </span>
                  
                  <span className="font-sans font-medium text-xl md:text-3xl lg:text-5xl xl:text-7xl whitespace-nowrap"> YOUR BRAND WITH</span>
                </div>
                <div className="flex flex-row justify-center items-end w-full max-w-5xl mx-auto mt-0">
                  <span className="font-baskerville italic font-thin tracking-tighter text-5xl md:text-7xl lg:text-8xl xl:text-9xl">creativity</span>
                  <span className="w-3 md:w-4"></span>
                  <span className="font-sans font-medium text-5xl md:text-7xl lg:text-8xl xl:text-9xl ">{" "}AND{" "}</span>
                  <span className="w-3 md:w-4"></span>
                  <span className="font-baskerville italic font-thin tracking-tighter text-5xl md:text-7xl lg:text-8xl xl:text-9xl">chaos</span>
                </div>
              </span>
            </header>
          </div>
        </div>
      </section>

      {/* Video Section Below */}
      <section className="relative w-full h-[40vh] grayscale-100 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover filter grayscale-[0.3] opacity-75"
        >
          <source src="/marquetmedia.mp4" type="video/mp4" />
        </video>
        
        {/* Refined overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      </section>
    </>
  );
}
