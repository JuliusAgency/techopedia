export default function HeroSectionPlaceholder() {
  return (
    <div className="text-gray-900 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 flex-shrink-0 w-16 h-16 animate-pulse" />
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </div>
      
      <div>
        <div className="h-12 bg-gray-200 rounded w-80 mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>
    </div>
  );
}

