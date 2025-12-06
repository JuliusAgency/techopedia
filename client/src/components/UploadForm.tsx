import { useState, useCallback } from 'react';
import { uploadDesign } from '../services/api';

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setError('Only SVG files are allowed');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadDesign(file);
      onUploadSuccess?.();
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [onUploadSuccess]);

  return (
    <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
      <label className="block mb-3 text-sm font-medium text-gray-700">
        Upload SVG File
      </label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".svg"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-600 cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/80 file:text-gray-700 hover:file:bg-white file:cursor-pointer file:transition-all file:duration-200 file:shadow-sm file:border file:border-gray-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <span className="text-sm text-gray-600 animate-fade-in">Uploading...</span>
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 animate-fade-in bg-red-50/80 rounded-xl px-3 py-2 border border-red-100/50">{error}</p>
      )}
    </div>
  );
}

