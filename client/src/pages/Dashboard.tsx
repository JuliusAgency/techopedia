import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDesigns, fetchDesignById } from '../services/api';
import { DesignListItem, Design } from '../types/Design';
import UploadForm from '../components/UploadForm';
import Squares from '../components/Squares';
import HeroCards from '@/pages/Dashboard/components/HeroCards';
import DesignTable from '@/pages/Dashboard/components/DesignTable';
import HeroSectionPlaceholder from '@/pages/Dashboard/components/HeroSectionPlaceholder';

const HeroSection = lazy(() => import('@/pages/Dashboard/components/HeroSection'));

export default function Dashboard() {
  const [designs, setDesigns] = useState<DesignListItem[]>([]);
  const [heroDesigns, setHeroDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [processingUpload, setProcessingUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDesignsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDesigns();
      setDesigns(data);
    } catch (err) {
      setError('Failed to load designs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHeroDesigns = useCallback(async () => {
    try {
      setHeroLoading(true);
      const data = await fetchDesigns();
      const processedDesigns = data.filter((d: DesignListItem) => d.status === 'processed');
      
      const designPromises = processedDesigns.slice(0, 5).map((design: DesignListItem) =>
        fetchDesignById(design.id).catch(() => null)
      );
      
      const fullDesigns = await Promise.all(designPromises);
      const validDesigns = fullDesigns.filter((d): d is Design => d !== null && d.items && d.items.length > 0);
      setHeroDesigns(validDesigns);
    } catch (err) {
      console.error('Failed to load hero designs:', err);
    } finally {
      setHeroLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesignsList();
    fetchHeroDesigns();
  }, [fetchDesignsList, fetchHeroDesigns]);

  const handleRowClick = useCallback((id: string) => {
    navigate(`/design/${id}`);
  }, [navigate]);

  const handleCardClick = useCallback((index: number) => {
    if (heroDesigns[index]) {
      navigate(`/design/${heroDesigns[index].id}`);
    }
  }, [heroDesigns, navigate]);

  const handleUploadSuccess = useCallback(async () => {
    setProcessingUpload(true);
    
    // Wait for 5 seconds to allow backend processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Fetch updated designs after processing completes
    await Promise.all([fetchDesignsList(), fetchHeroDesigns()]);
    
    setProcessingUpload(false);
  }, [fetchDesignsList, fetchHeroDesigns]);

  const hasHeroDesigns = useMemo(() => heroDesigns.length > 0, [heroDesigns.length]);
  const shouldShowHero = useMemo(() => hasHeroDesigns || heroLoading, [hasHeroDesigns, heroLoading]);

  return (
    <div className="min-h-screen relative">
      {shouldShowHero && (
        <section className="relative px-4 overflow-hidden" style={{ height: '70vh', minHeight: '400px' }}>
          <div className="absolute inset-0 z-0">
            <Squares 
              speed={0.5} 
              squareSize={40}
              direction='diagonal'
              borderColor='#dadada'
              hoverFillColor='#222'
            />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 h-full flex items-center py-8 md:py-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center w-full">
              {hasHeroDesigns ? (
                <Suspense fallback={<HeroSectionPlaceholder />}>
                  <HeroSection />
                </Suspense>
              ) : (
                <HeroSectionPlaceholder />
              )}
              <div className="flex justify-center lg:justify-end items-center" style={{ height: '100%', position: 'relative', maxHeight: '70vh' }}>
                <HeroCards 
                  designs={heroDesigns} 
                  loading={heroLoading} 
                  onCardClick={handleCardClick}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative py-8 px-4">
        <div className="fixed inset-0 z-0">
          <Squares 
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">All Designs</h1>
          
          <div className="animate-slide-up animate-delay-100">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 animate-fade-in">Loading designs...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600 animate-fade-in">{error}</div>
          ) : designs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 animate-fade-in">No designs found. Upload an SVG file to get started.</div>
          ) : (
            <DesignTable designs={designs} onRowClick={handleRowClick} />
          )}
        </div>
      </div>
    </div>
  );
}
