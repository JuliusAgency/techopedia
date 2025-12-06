interface StatItemProps {
  label: string;
  value: string | number;
  delay?: string;
}

function StatItem({ label, value, delay = '200' }: StatItemProps) {
  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50 animate-slide-up animate-delay-${delay}`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

interface DesignStatsProps {
  svgWidth: number;
  svgHeight: number;
  itemsCount: number;
  coverageRatio: number;
}

export default function DesignStats({ svgWidth, svgHeight, itemsCount, coverageRatio }: DesignStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatItem label="SVG Width" value={`${svgWidth}px`} delay="200" />
      <StatItem label="SVG Height" value={`${svgHeight}px`} delay="300" />
      <StatItem label="Items Count" value={itemsCount} delay="400" />
      <StatItem label="Coverage Ratio" value={`${(coverageRatio * 100).toFixed(2)}%`} delay="500" />
    </div>
  );
}

