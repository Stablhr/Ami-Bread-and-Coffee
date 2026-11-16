'use client';

import {useId, useRef, useState} from 'react';
import {ImageUp, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ProductPhoto} from '@/components/menu/product-photo';
import {uploadProductPhoto} from '@/lib/api/adminMenuApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {resizeImage} from '@/lib/image-resize';

const ACCEPT = 'image/jpeg,image/png,image/webp';

/**
 * Pick a photo → it is shrunk in the browser → uploaded right away → the
 * form keeps the returned URL. The product itself is saved with "Save".
 */
export function PhotoField({
  value,
  onChange,
  productName
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  productName: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!ACCEPT.split(',').includes(file.type)) {
      setError('Please choose a JPG, PNG or WebP photo.');
      return;
    }
    setStatus('uploading');
    try {
      const {blob, filename} = await resizeImage(file);
      const url = await uploadProductPhoto(blob, filename);
      onChange(url);
    } catch (uploadError) {
      setError(getFriendlyErrorMessage(uploadError, 'We could not upload that photo. Please try again.'));
    } finally {
      setStatus('idle');
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ProductPhoto url={value} alt={productName || 'Product photo'} sizes="160px" className="w-40 shrink-0" />
      <div className="space-y-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={event => handleFile(event.target.files?.[0])}
          disabled={status === 'uploading'}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={status === 'uploading'}
            onClick={() => inputRef.current?.click()}
          >
            <ImageUp aria-hidden="true" />
            {status === 'uploading' ? 'Uploading…' : value ? 'Change photo' : 'Upload photo'}
          </Button>
          {value && (
            <Button type="button" variant="destructive" size="sm" onClick={() => onChange(null)} disabled={status === 'uploading'}>
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-sm text-ink-soft">JPG, PNG or WebP. Big phone photos are shrunk automatically.</p>
        {error && (
          <p role="alert" className="text-sm font-bold text-tomato">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
