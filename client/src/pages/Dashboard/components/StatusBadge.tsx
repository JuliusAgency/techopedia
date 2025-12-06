import { getStatusColor } from './utils';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

