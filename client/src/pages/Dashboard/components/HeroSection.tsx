import FeatureCard from './FeatureCard';

export default function HeroSection() {
  return (
    <div className="text-gray-900 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-gray-900">
          Design Analyzer
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
          Transform your SVG designs into actionable insights. Get comprehensive analysis 
          of every element in your design files with our intelligent processing system.
        </p>
      </div>
      
      <div className="space-y-4">
        <FeatureCard
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Automatic Detection"
          description="Instantly identifies all rectangles in your SVG files, extracting precise coordinates, dimensions, fill colors, and positioning data for comprehensive analysis."
        />

        <FeatureCard
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          title="Issue Detection"
          description="Automatically flags problematic elements including out-of-bounds rectangles, missing fills, and elements that extend beyond the SVG viewport boundaries."
        />

        <FeatureCard
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          title="Visual Preview"
          description="Interactive canvas preview with hover tooltips showing detailed properties. Click on any design card to explore the full analysis and view all detected elements."
        />
      </div>

      <div className="pt-2">
        <p className="text-sm text-gray-600 italic">
          Simply upload your SVG file and watch as our system processes and analyzes every element in seconds.
        </p>
      </div>
    </div>
  );
}

