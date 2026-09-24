import React, { useState, useEffect } from 'react';
import './ImageMagnifier.css';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  zoomLevel?: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ src, alt, zoomLevel = 2 }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Boundary checks for the lens
    const lensSize = 150; // assuming lens is 150px
    const halfLens = lensSize / 2;
    
    let clampedX = x;
    let clampedY = y;
    
    if (clampedX < halfLens) clampedX = halfLens;
    if (clampedX > width - halfLens) clampedX = width - halfLens;
    if (clampedY < halfLens) clampedY = halfLens;
    if (clampedY > height - halfLens) clampedY = height - halfLens;

    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setPosition({ x: xPercent, y: yPercent });
    setCursorPos({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setShowZoom(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setShowZoom(false);
  };

  const handleClick = () => {
    setIsFullscreen(true);
  };

  return (
    <>
      <div className="magnifier-wrapper" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
      <div 
        className="magnifier-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <img src={src} alt={alt} className="magnifier-image" />
        
        {showZoom && (
          <div 
            className="magnifier-lens"
            style={{
              left: cursorPos.x - 75,
              top: cursorPos.y - 75
            }}
          />
        )}

        {showZoom && (
          <div 
            className="magnifier-preview"
            style={{
              backgroundImage: `url('${src}')`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: `${zoomLevel * 100}%`
            }}
          />
        )}
      </div>
      <div className="click-to-expand" style={{marginTop: '15px', color: '#007185', cursor: 'pointer', fontSize: '13px'}} onClick={handleClick}>
        Click to see full view
      </div>
      </div>

      {isFullscreen && (
        <div className="magnifier-fullscreen-modal" onClick={() => setIsFullscreen(false)}>
          <button className="magnifier-close-btn">×</button>
          <img src={src} alt={alt} />
        </div>
      )}
    </>
  );
};

export default ImageMagnifier;
