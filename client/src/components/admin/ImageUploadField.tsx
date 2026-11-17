import React, { useState } from 'react';
import { ImagePlus, LoaderCircle, Link2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange, optional }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be 8 MB or smaller.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('image', file);
      const response = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('mens_outfit_admin_token') || ''}` },
        body,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.message || 'Image upload failed.');
      }
      onChange(result.data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700 block">{label}{optional ? ' (optional)' : ''}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <label className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Choose image file'}
          <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={uploading} onChange={handleFile} />
        </label>
        <div className="relative flex-1">
          <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Or paste an image URL" className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900" />
        </div>
      </div>
      {error && <p className="text-xs text-rose-600" role="alert">{error}</p>}
      {value && <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200"><img src={value} alt="Selected image preview" className="w-12 h-12 object-cover rounded" /><span className="text-[11px] text-slate-500 break-all">Image ready to save</span></div>}
    </div>
  );
};
