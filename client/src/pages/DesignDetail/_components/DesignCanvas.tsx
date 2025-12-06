import CanvasPreview from '../../../components/CanvasPreview';
import { DesignItem } from '../../../types/Design';

interface DesignCanvasProps {
  svgWidth: number;
  svgHeight: number;
  items: DesignItem[];
}

export default function DesignCanvas({ svgWidth, svgHeight, items }: DesignCanvasProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 animate-scale-in animate-delay-400">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Canvas Preview</h2>
      <div className="w-full overflow-auto">
        <div className="flex justify-center min-w-fit">
          <CanvasPreview
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            items={items}
          />
        </div>
      </div>
    </div>
  );
}

