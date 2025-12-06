import { useCallback } from 'react';
import { DesignListItem } from '../../../types/Design';
import { formatDate } from '../components/utils';
import StatusBadge from './StatusBadge';

interface DesignTableProps {
  designs: DesignListItem[];
  onRowClick: (id: string) => void;
}

export default function DesignTable({ designs, onRowClick }: DesignTableProps) {
  const handleRowClick = useCallback((id: string) => {
    onRowClick(id);
  }, [onRowClick]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden animate-scale-in animate-delay-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-white/50">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Filename
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-gray-100">
            {designs.map((design, index) => (
              <tr
                key={design.id}
                onClick={() => handleRowClick(design.id)}
                className="hover:bg-white/90 cursor-pointer transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${0.3 + index * 0.05}s`, opacity: 0 }}
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {design.filename}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={design.status} />
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {design.itemsCount}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(design.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

