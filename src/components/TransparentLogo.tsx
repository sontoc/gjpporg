import React, { useEffect, useState } from 'react';

interface TransparentLogoProps {
  src: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export function TransparentLogo({ src, className, alt, style }: TransparentLogoProps) {
  const [processedSrc, setProcessedSrc] = useState(src);

  useEffect(() => {
    // Reset processedSrc first when src changes
    setProcessedSrc(src);

    const isPng = src && src.toLowerCase().includes('.png');
    if (!src || !isPng) {
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          const brightness = (r + g + b) / 3;

          // 1. Smoothly map near-white pixels to transparent to avoid jagged edges (anti-aliasing)
          if (brightness > 240) {
            data[i + 3] = 0;
          } else if (brightness > 190) {
            const ratio = (240 - brightness) / 50;
            data[i + 3] = Math.round(a * ratio);
          }

          // 2. Adjust dark text lines (black/grey text) to crisp white/light grey for perfect legibility on black background
          // Colored pixels like the blue icons (highly saturated) will NOT be affected.
          const isGreyscale = Math.abs(r - g) < 30 && Math.abs(g - b) < 30;
          if (isGreyscale && brightness < 150) {
            const factor = (150 - brightness) / 150; // Map darker pixels to stronger white
            data[i] = Math.min(255, Math.round(r + (255 - r) * factor));
            data[i + 1] = Math.min(255, Math.round(g + (255 - g) * factor));
            data[i + 2] = Math.min(255, Math.round(b + (255 - b) * factor));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL());
      } catch (err) {
        console.warn("CORS or canvas processing failed, falling back to original image", err);
        setProcessedSrc(src);
      }
    };

    img.onerror = () => {
      // If anonymous CORS load fails, reload without CORS to at least display the image
      if (img.crossOrigin === 'anonymous') {
        const fallbackImg = new Image();
        fallbackImg.src = src;
        fallbackImg.onload = () => {
          setProcessedSrc(src);
        };
        fallbackImg.onerror = () => {
          setProcessedSrc(src);
        };
      } else {
        setProcessedSrc(src);
      }
    };
  }, [src]);

  return (
    <img 
      src={processedSrc} 
      className={className} 
      alt={alt} 
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
