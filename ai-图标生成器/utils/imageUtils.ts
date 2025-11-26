import JSZip from 'jszip';
import { GeneratedIcon, IconStyle, ImageTracerOptions } from '../types';

/**
 * Preprocesses an image for better vectorization.
 * For Iconfont style, it applies a strict binary threshold (B&W).
 */
export const getProcessedImageData = (
  base64: string,
  style: IconStyle
): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64}`;
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // If Iconfont style, force binary black and white for clean paths
      if (style === IconStyle.ICONFONT) {
        const data = imageData.data;
        const threshold = 128; // Standard midpoint
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Calculate luminance
          const avg = (r + g + b) / 3;
          
          // Invert logic: We want black icons on white background usually, 
          // but for tracing, we often want the "dark" part to be the path.
          // ImageTracer traces colors. 
          // Let's enforce strict black (0,0,0) and white (255,255,255).
          const val = avg < threshold ? 0 : 255;
          
          data[i] = val;     // R
          data[i + 1] = val; // G
          data[i + 2] = val; // B
          data[i + 3] = 255; // Alpha (fully opaque)
        }
      }

      resolve(imageData);
    };
    
    img.onerror = (err) => reject(err);
  });
};

/**
 * Converts ImageData to SVG string using ImageTracer.
 */
export const convertToSvg = async (base64: string, style: IconStyle): Promise<string> => {
  if (!window.ImageTracer) {
    throw new Error('ImageTracer library not loaded');
  }

  const imageData = await getProcessedImageData(base64, style);

  // Configuration tuned for icons
  const options: ImageTracerOptions = {
    ltres: 1, // Linear error threshold (lower = more detailed)
    qtres: 1, // Quadratic error threshold (lower = more detailed)
    pathomit: 8, // Remove small paths (noise reduction)
    rightangleenhance: style === IconStyle.ICONFONT || style === IconStyle.FLAT, // Enhance right angles for geometric icons
    colorsampling: 2, // 0=disabled, 1=random, 2=deterministic
    numberofcolors: style === IconStyle.ICONFONT ? 2 : 16, // Low colors for B&W
    mincolorratio: 0,
    colorquantcycles: 3,
    strokewidth: 0,
    viewbox: true,
    scale: 1,
  };

  return window.ImageTracer.imagedataToSVG(imageData, options);
};

/**
 * Downloads a single file.
 */
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const link = document.createElement('a');
  if (mimeType.includes('svg')) {
     const blob = new Blob([content], { type: mimeType });
     link.href = URL.createObjectURL(blob);
  } else {
     link.href = content.startsWith('data:') ? content : `data:${mimeType};base64,${content}`;
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Batch downloads all icons as a ZIP file.
 */
export const downloadZip = async (icons: GeneratedIcon[]) => {
  const zip = new JSZip();
  const folder = zip.folder("icons");

  if (!folder) return;

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const filenameBase = `icon_${i + 1}_${icon.style.toLowerCase()}`;
    
    // Add PNG
    folder.file(`${filenameBase}.png`, icon.base64, { base64: true });
    
    // Convert and Add SVG
    try {
      // If SVG is not cached, generate it on the fly
      const svgString = icon.svg || await convertToSvg(icon.base64, icon.style);
      folder.file(`${filenameBase}.svg`, svgString);
    } catch (e) {
      console.warn(`Failed to convert ${filenameBase} to SVG`, e);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = "ai_icons_bundle.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};