import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { DesignItem } from '../types/Design';

interface CanvasPreviewProps {
  svgWidth: number;
  svgHeight: number;
  items: DesignItem[];
}

interface TooltipData {
  x: number;
  y: number;
  item: DesignItem;
}

interface ScaleData {
  scaleFactor: number;
  offsetX: number;
  offsetY: number;
  scaledWidth: number;
  scaledHeight: number;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PADDING = 20;

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export default function CanvasPreview({ svgWidth, svgHeight, items }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  const calculateScale = useCallback((): ScaleData | null => {
    if (svgWidth <= 0 || svgHeight <= 0) {
      return null;
    }

    const availableWidth = CANVAS_WIDTH - PADDING * 2;
    const availableHeight = CANVAS_HEIGHT - PADDING * 2;

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
  }, [svgWidth, svgHeight]);

  const canvasToSvgCoordinates = useCallback((canvasX: number, canvasY: number): { x: number; y: number } | null => {
    const scaleData = calculateScale();
    if (!scaleData) return null;

    const svgX = (canvasX - scaleData.offsetX) / scaleData.scaleFactor;
    const svgY = (canvasY - scaleData.offsetY) / scaleData.scaleFactor;

    return { x: svgX, y: svgY };
  }, [calculateScale]);

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
        animationFrameRef.current = requestAnimationFrame(() => {
          setTimeout(animate, 30);
        });
      }
    };

    setTimeout(animate, 100);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [items]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      } else {
        ctx.strokeStyle = `rgba(209, 213, 219, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
      }
    });
  }, [svgWidth, svgHeight, items, calculateScale, visibleItems]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const canvasX = (mouseX / rect.width) * CANVAS_WIDTH;
    const canvasY = (mouseY / rect.height) * CANVAS_HEIGHT;

    const svgCoords = canvasToSvgCoordinates(canvasX, canvasY);
    if (!svgCoords) {
      setTooltip(null);
      return;
    }

    const hoveredItem = items.find(item => {
      return svgCoords.x >= item.x &&
             svgCoords.x <= item.x + item.width &&
             svgCoords.y >= item.y &&
             svgCoords.y <= item.y + item.height;
    });

    if (hoveredItem) {
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setTooltip({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
          item: hoveredItem
        });
      }
    } else {
      setTooltip(null);
    }
  }, [items, canvasToSvgCoordinates]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const tooltipStyle = useMemo(() => {
    if (!tooltip) return {};
    return {
      left: `${Math.min(tooltip.x + 10, CANVAS_WIDTH - 150)}px`,
      top: `${Math.min(tooltip.y + 10, CANVAS_HEIGHT - 100)}px`,
      maxWidth: '200px'
    };
  }, [tooltip]);

  return (
    <div ref={containerRef} className="relative inline-block animate-fade-in">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="border border-gray-200/50 bg-white cursor-crosshair rounded-xl shadow-sm"
      />
      {tooltip && (
        <div
          className="absolute bg-white/95 backdrop-blur-sm text-gray-900 text-xs px-3 py-2 rounded-xl pointer-events-none z-50 shadow-lg border border-gray-100/50 animate-fade-in"
          style={tooltipStyle}
        >
          <div className="font-semibold mb-1.5 text-gray-900">Rectangle Details</div>
          <div className="text-gray-700">X: {tooltip.item.x.toFixed(2)}</div>
          <div className="text-gray-700">Y: {tooltip.item.y.toFixed(2)}</div>
          <div className="text-gray-700">W: {tooltip.item.width.toFixed(2)}</div>
          <div className="text-gray-700">H: {tooltip.item.height.toFixed(2)}</div>
          <div className="text-gray-700">Fill: {tooltip.item.fill}</div>
          <div className="text-gray-700">Issue: {tooltip.item.hasIssue ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}
