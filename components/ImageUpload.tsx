'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  /** Current image URL */
  value?: string;
  /** Callback when image is uploaded */
  onChange: (url: string) => void;
  /** Cloudinary folder for organization */
  folder?: 'thumbnails' | 'books' | 'avatars' | 'general';
  /** Aspect ratio for preview */
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  /** Custom class name */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  aspectRatio = 'video',
  className,
  placeholder = 'Click or drag image to upload',
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: 'min-h-[150px]',
  }[aspectRatio];

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progress for UX (Cloudinary doesn't provide upload progress easily)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await uploadToCloudinary(file, folder);
      setUploadProgress(100);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [folder, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        // Image Preview
        <div className={cn('relative rounded-lg overflow-hidden border border-border group', aspectRatioClass)}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Upload success indicator */}
          {uploadProgress === 100 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 animate-in zoom-in">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      ) : (
        // Upload Zone
        <div
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-all cursor-pointer',
            aspectRatioClass,
            'flex flex-col items-center justify-center gap-2 p-4',
            isDragging && !disabled && 'border-primary bg-primary/10',
            !isDragging && !disabled && 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed',
            isUploading && 'pointer-events-none'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-foreground/70">Uploading... {uploadProgress}%</span>
              
              {/* Progress bar */}
              <div className="w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <ImageIcon className="w-6 h-6 text-foreground/50" />
              </div>
              <span className="text-sm text-foreground/70 text-center">{placeholder}</span>
              <span className="text-xs text-foreground/50">PNG, JPG up to 10MB</span>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
