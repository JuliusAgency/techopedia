import { DesignListItem, Design } from '../types/Design';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const uploadDesign = async (file: File): Promise<{ id: string; filename: string; status: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

export const fetchDesigns = async (): Promise<DesignListItem[]> => {
  const response = await fetch(`${API_BASE}/designs`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch designs');
  }

  return response.json();
};

export const fetchDesignById = async (id: string): Promise<Design> => {
  const response = await fetch(`${API_BASE}/designs/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch design');
  }

  return response.json();
};
