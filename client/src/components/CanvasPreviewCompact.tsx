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
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

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

  useEffect(() => {
    setVisibleItems(new Set());
    
    if (!items || items.length === 0) return;

    let currentIndex = 0;
    const animate = () => {
      if (currentIndex < items.length) {
        setVisibleItems(prev => {
          const next = new Set(prev);
          next.add(currentIndex);
          return next;
        });
        currentIndex++;
        setTimeout(animate, 20);
      }
    };

    setTimeout(animate, 50);
  }, [items]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

  const canvasStyle = useMemo(() => ({ maxWidth: '100%', height: 'auto' }), []);

  return (
    <div className="relative inline-block">
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

