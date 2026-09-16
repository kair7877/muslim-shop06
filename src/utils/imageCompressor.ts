export async function compressImage(
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
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
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Guard against oversized base64 (> 250KB) to protect Firestore document size
        if (dataUrl.length > 250000) {
          const secondCanvas = document.createElement('canvas');
          const scale = 0.75;
          secondCanvas.width = Math.round(width * scale);
          secondCanvas.height = Math.round(height * scale);
          const ctx2 = secondCanvas.getContext('2d');
          if (ctx2) {
            ctx2.drawImage(img, 0, 0, secondCanvas.width, secondCanvas.height);
            dataUrl = secondCanvas.toDataURL('image/jpeg', 0.65);
          }
        }

        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
}

