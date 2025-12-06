import { getStatusColor } from '../components/utils';

interface DesignHeaderProps {
  filename: string;
  status: string;
}

export default function DesignHeader({ filename, status }: DesignHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{filename}</h1>
      <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
}

