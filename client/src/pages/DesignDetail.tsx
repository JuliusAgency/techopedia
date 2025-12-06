import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDesignById } from '../services/api';
import { Design } from '../types/Design';
import DesignHeader from '@/pages/DesignDetail/components/DesignHeader';
import DesignStats from '@/pages/DesignDetail/components/DesignStats';
import DesignIssues from '@/pages/DesignDetail/components/DesignIssues';
import DesignCanvas from '@/pages/DesignDetail/components/DesignCanvas';
import { formatDate } from '@/pages/DesignDetail/components/utils';

export default function DesignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesign = useCallback(async (designId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDesignById(designId);
      setDesign(data);
    } catch (err) {
      setError('Failed to load design');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDesign(id);
    }
  }, [id, fetchDesign]);

  const handleBackClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white/80 backdrop-blur-sm py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-gray-500 animate-fade-in">Loading design...</div>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-white/80 backdrop-blur-sm py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-600 animate-fade-in">{error || 'Design not found'}</div>
          <button
            onClick={handleBackClick}
            className="mt-4 mx-auto block px-6 py-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-all duration-200 shadow-sm border border-gray-100 animate-scale-in animate-delay-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/80 backdrop-blur-sm py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBackClick}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-all duration-200 px-4 py-2 rounded-xl hover:bg-white/90 backdrop-blur-sm animate-fade-in"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6 animate-scale-in animate-delay-100">
          <DesignHeader filename={design.filename} status={design.status} />
          <DesignStats 
            svgWidth={design.svgWidth}
            svgHeight={design.svgHeight}
            itemsCount={design.itemsCount}
            coverageRatio={design.coverageRatio}
          />
          <div className="text-sm text-gray-600 mb-2">Created At</div>
          <div className="text-gray-900 mb-6">{formatDate(design.createdAt)}</div>
          <DesignIssues issues={design.issues} />
        </div>

        {design.status === 'processed' && design.items.length > 0 && (
          <DesignCanvas
            svgWidth={design.svgWidth}
            svgHeight={design.svgHeight}
            items={design.items}
          />
        )}

        {design.status === 'pending' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 text-center text-gray-600 animate-fade-in animate-delay-300">
            Design is being processed. Please refresh the page in a moment.
          </div>
        )}

        {design.status === 'error' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 text-center text-red-600 animate-fade-in animate-delay-300">
            An error occurred while processing this design.
          </div>
        )}
      </div>
    </div>
  );
}
