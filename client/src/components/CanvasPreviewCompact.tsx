import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { DesignItem } from '../types/Design';

interface CanvasPreviewCompactProps {
  svgWidth: number;
  svgHeight: number;
  items: DesignItem[];
  maxWidth?: number;
  maxHeight?: number;
}

interface ScaleData {
  scaleFactor: number;
  offsetX: number;
  offsetY: number;
  scaledWidth: number;
  scaledHeight: number;
}

const PADDING = 10;

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export default function CanvasPreviewCompact({ 
  svgWidth, 
  svgHeight, 
  items,
  maxWidth = 450,
  maxHeight = 300
}: CanvasPreviewCompactProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const animationTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const calculateScale = useCallback((): ScaleData | null => {
    if (svgWidth <= 0 || svgHeight <= 0) {
      return null;
    }

    const availableWidth = maxWidth - PADDING * 2;
    const availableHeight = maxHeight - PADDING * 2;

    if (availableWidth <= 0 || availableHeight <= 0) {
      return null;
    }

    const scaleX = availableWidth / svgWidth;
    const scaleY = availableHeight / svgHeight;
    const scaleFactor = Math.min(scaleX, scaleY);

    if (scaleFactor <= 0 || !isFinite(scaleFactor)) {
      return null;
    }

    const scaledWidth = svgWidth * scaleFactor;
    const scaledHeight = svgHeight * scaleFactor;
    const offsetX = PADDING + (availableWidth - scaledWidth) / 2;
    const offsetY = PADDING + (availableHeight - scaledHeight) / 2;

    return { scaleFactor, offsetX, offsetY, scaledWidth, scaledHeight };
  }, [svgWidth, svgHeight, maxWidth, maxHeight]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMountedRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    ctx.clearRect(0, 0, maxWidth, maxHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    const scaleData = calculateScale();
    if (!scaleData || !items || items.length === 0) {
      return;
    }

    items.forEach((item, index) => {
      const isVisible = visibleItems.has(index);
      if (!isVisible) return;

      const x = scaleData.offsetX + item.x * scaleData.scaleFactor;
      const y = scaleData.offsetY + item.y * scaleData.scaleFactor;
      const width = item.width * scaleData.scaleFactor;
      const height = item.height * scaleData.scaleFactor;

      const fillColor = item.fill && item.fill !== 'none' && item.fill !== 'transparent' && item.fill !== ''
        ? item.fill
        : '#e5e7eb';

      const opacity = isVisible ? 1 : 0;
      const rgb = hexToRgb(fillColor);
      if (rgb) {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      } else {
        ctx.fillStyle = fillColor;
      }
      ctx.fillRect(x, y, width, height);

      if (item.hasIssue) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, width, height);
      } else {
        ctx.strokeStyle = `rgba(209, 213, 219, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, width, height);
      }
    });
  }, [svgWidth, svgHeight, items, calculateScale, visibleItems, maxWidth, maxHeight]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (animationTimeoutRef.current !== null) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    setVisibleItems(new Set());
    
    if (!items || items.length === 0) {
      return;
    }

    const showAllItems = () => {
      if (!isMountedRef.current) return;
      const allIndices = new Set(items.map((_, index) => index));
      setVisibleItems(allIndices);
    };

    animationTimeoutRef.current = window.setTimeout(showAllItems, 50);

    return () => {
      isMountedRef.current = false;
      if (animationTimeoutRef.current !== null) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [items]);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      drawCanvas();
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [visibleItems, svgWidth, svgHeight, items, maxWidth, maxHeight, calculateScale, drawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.width !== maxWidth || canvas.height !== maxHeight) {
      canvas.width = maxWidth;
      canvas.height = maxHeight;
    }

    rafRef.current = requestAnimationFrame(() => {
      drawCanvas();
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [maxWidth, maxHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            if (rafRef.current !== null) {
              cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = requestAnimationFrame(() => {
              drawCanvas();
            });
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [drawCanvas]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (animationTimeoutRef.current !== null) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const canvasStyle = useMemo(() => ({ maxWidth: '100%', height: 'auto' }), []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={maxWidth}
        height={maxHeight}
        className="border border-gray-200/50 bg-white rounded-lg shadow-sm"
        style={canvasStyle}
      />
    </div>
  );
}

