/**
 * Client-side Image Compression Utility
 * Mencegah lag dan loading lama dengan mengompres foto secara otomatis
 * sebelum disimpan ke base64/localStorage atau diupload ke storage.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ file: File; dataUrl: string; sizeReductionPercent: number }> {
  // Lewati kompresi jika bukan gambar, atau jika GIF/SVG
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const dataUrl = await fileToDataUrl(file);
    return { file, dataUrl, sizeReductionPercent: 0 };
  }

  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.82,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Hitung skala rasio agar tidak melebihi batas resolusi maksimal
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const originalDataUrl = (e.target?.result as string) || '';
          resolve({ file, dataUrl: originalDataUrl, sizeReductionPercent: 0 });
          return;
        }

        // Render dengan kualitas gambar tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file, dataUrl, sizeReductionPercent: 0 });
              return;
            }

            // Jika hasil kompresi ternyata lebih besar dari aslinya, gunakan aslinya
            if (blob.size >= file.size && width === img.width && height === img.height) {
              resolve({ file, dataUrl: (e.target?.result as string) || dataUrl, sizeReductionPercent: 0 });
              return;
            }

            const extension = mimeType === 'image/webp' ? '.webp' : '.jpg';
            const newFileName = file.name.replace(/\.[^/.]+$/, extension);
            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now()
            });

            const reduction = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

            resolve({
              file: compressedFile,
              dataUrl,
              sizeReductionPercent: reduction
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve({ file, dataUrl: (e.target?.result as string) || '', sizeReductionPercent: 0 });
      };

      img.src = (e.target?.result as string) || '';
    };

    reader.onerror = () => {
      resolve({ file, dataUrl: '', sizeReductionPercent: 0 });
    };

    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
