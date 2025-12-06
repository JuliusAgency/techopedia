import { useCallback } from 'react';
import CardSwap, { Card } from '../../../components/CardSwap';
import CanvasPreviewCompact from '../../../components/CanvasPreviewCompact';
import { Design } from '../../../types/Design';

interface HeroCardsProps {
  designs: Design[];
  loading: boolean;
  onCardClick: (index: number) => void;
}

export default function HeroCards({ designs, loading, onCardClick }: HeroCardsProps) {
  const handleCardClick = useCallback((index: number) => {
    onCardClick(index);
  }, [onCardClick]);

  if (loading) {
    return <div className="text-gray-900">Loading previews...</div>;
  }

  if (designs.length === 0) {
    return <div className="text-gray-900">No processed designs to showcase</div>;
  }

  return (
    <CardSwap
      cardDistance={60}
      verticalDistance={70}
      delay={5000}
      pauseOnHover={false}
      onCardClick={handleCardClick}
      width={450}
      height={350}
    >
      {designs.map((design) => (
        <Card 
          key={design.id} 
          customClass="bg-white/95 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
        >
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">{design.filename}</h3>
            <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
              {design.status === 'processed' && design.items.length > 0 ? (
                <CanvasPreviewCompact
                  key={design.id}
                  svgWidth={design.svgWidth}
                  svgHeight={design.svgHeight}
                  items={design.items}
                  maxWidth={450}
                  maxHeight={280}
                />
              ) : (
                <p className="text-gray-500 text-sm">No preview available</p>
              )}
            </div>
            <div className="mt-3 text-xs text-gray-600 flex items-center justify-between">
              <span>{design.itemsCount} items</span>
              <span>{(design.coverageRatio * 100).toFixed(1)}% coverage</span>
            </div>
          </div>
        </Card>
      ))}
    </CardSwap>
  );
}

