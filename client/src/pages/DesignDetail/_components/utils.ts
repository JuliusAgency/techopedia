export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'processed':
      return 'text-green-700 bg-green-50/80';
    case 'error':
      return 'text-red-700 bg-red-50/80';
    default:
      return 'text-gray-700 bg-gray-50/80';
  }
};

