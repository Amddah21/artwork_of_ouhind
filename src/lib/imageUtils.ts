// Image optimization utilities
export const generateImageUrl = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If it's already a Supabase URL, we can add transformation parameters
  if (src.includes('supabase.co')) {
    const url = new URL(src);
    const params = new URLSearchParams();
    
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    if (quality) params.append('quality', quality.toString());
    if (format) params.append('format', format);
    
    return `${url.origin}${url.pathname}?${params.toString()}`;
  }
  
  // For local images, return as-is (they should be optimized during build)
  return src;
};

export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (srcs: string[]): Promise<void> => {
  await Promise.all(srcs.map(src => preloadImage(src)));
};
