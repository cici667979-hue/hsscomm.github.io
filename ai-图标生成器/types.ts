export enum IconStyle {
  CLAY_3D = 'CLAY_3D',
  FLAT = 'FLAT',
  ICONFONT = 'ICONFONT',
}

export interface GeneratedIcon {
  id: string;
  base64: string;
  prompt: string;
  style: IconStyle;
  svg?: string; // Cache for generated SVG
}

export interface ImageTracerOptions {
  ltres?: number;
  qtres?: number;
  pathomit?: number;
  rightangleenhance?: boolean;
  colorsampling?: number;
  numberofcolors?: number;
  mincolorratio?: number;
  colorquantcycles?: number;
  layering?: number;
  strokewidth?: number;
  viewbox?: boolean;
  desc?: boolean;
  lcpr?: number;
  qcpr?: number;
  scale?: number;
}

// Augment window for external library
declare global {
  interface Window {
    ImageTracer: {
      imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions): string;
      appendSVGString(svgString: string, parentId: string): void;
    };
  }
}