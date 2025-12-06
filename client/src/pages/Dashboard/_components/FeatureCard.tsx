interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900 text-lg font-bold mb-1.5">{title}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

