/**
 * Cloudinary Configuration & Upload Utilities
 * 
 * Cloud Name: dckgjhlsq
 * Upload URL: https://api.cloudinary.com/v1_1/dckgjhlsq/image/upload
 * 
 * Supports both unsigned uploads (with preset) and signed uploads (via API route)
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dckgjhlsq',
  apiKey: process.env.CLOUDINARY_API_KEY || '657885322772846',
  uploadPreset: 'slic_nations', // Optional: Create this preset in Cloudinary dashboard as "unsigned"
  folder: 'slic-nations',
};

// Upload URL for direct uploads
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

/**
 * Upload image to Cloudinary using signed upload (more reliable)
 * Falls back to unsigned if signed fails
 */
export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<{ url: string; publicId: string }> {
  const fullFolder = folder ? `${CLOUDINARY_CONFIG.folder}/${folder}` : CLOUDINARY_CONFIG.folder;
  
  // Try signed upload first (more reliable)
  try {
    const signatureResponse = await fetch('/api/cloudinary-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: fullFolder }),
    });
    
    if (signatureResponse.ok) {
      const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', apiKey);
      formData.append('folder', fullFolder);
      
      const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        return {
          url: data.secure_url,
          publicId: data.public_id,
        };
      }
    }
  } catch (error) {
    console.log('Signed upload failed, trying unsigned...', error);
  }
  
  // Fallback to unsigned upload (requires preset to be configured)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', fullFolder);
  
  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);
  
  // Insert transforms after /upload/
  const transformString = transforms.join(',');
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Generate thumbnail URL from video ID (for YouTube)
 * Falls back to a placeholder if no URL provided
 */
export function getThumbnailUrl(
  customUrl?: string,
  youtubeId?: string
): string {
  if (customUrl) return customUrl;
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  return 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop';
}
