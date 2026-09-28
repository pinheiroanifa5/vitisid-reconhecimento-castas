/**
 * Reads a File and resizes it if larger than maxDimension to ensure fast uploading
 * and optimal detail for Gemini vision analysis.
 */
export async function processImageFile(file: File, maxDimension = 1800): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o ficheiro de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar os dados da imagem.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            base64: reader.result as string,
            mimeType: file.type || 'image/jpeg',
          });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        resolve({
          base64: dataUrl,
          mimeType,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a sample URL (e.g. bundled image asset) to a data base64 string
 */
export async function sampleUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao processar a amostra.'));
    reader.onload = () => {
      resolve({
        base64: reader.result as string,
        mimeType,
      });
    };
    reader.readAsDataURL(blob);
  });
}
