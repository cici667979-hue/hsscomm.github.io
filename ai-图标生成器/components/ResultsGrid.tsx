import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { Download, FileCode, Check, Image as ImageIcon } from 'lucide-react';
import { convertToSvg, downloadFile } from '../utils/imageUtils';

interface ResultsGridProps {
  icons: GeneratedIcon[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ icons }) => {
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownloadPng = (icon: GeneratedIcon) => {
    downloadFile(icon.base64, `icon_${icon.id}.png`, 'image/png');
    setDownloadedId(icon.id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  const handleDownloadSvg = async (icon: GeneratedIcon) => {
    setConvertingId(icon.id);
    try {
      // Use cached SVG if available, otherwise convert
      const svgContent = icon.svg || await convertToSvg(icon.base64, icon.style);
      // Cache it back (mutating prop for simplicity in this small app context, usually use state)
      icon.svg = svgContent;
      
      downloadFile(svgContent, `icon_${icon.id}.svg`, 'image/svg+xml');
      setDownloadedId(icon.id + '_svg');
      setTimeout(() => setDownloadedId(null), 2000);
    } catch (error) {
      console.error("SVG Conversion failed", error);
      alert("SVG 转换失败，请重试");
    } finally {
      setConvertingId(null);
    }
  };

  if (icons.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
      {icons.map((icon) => (
        <div 
          key={icon.id} 
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/30 transition-all duration-300"
        >
          {/* Image Display */}
          <div className="aspect-square w-full p-4 flex items-center justify-center bg-transparent">
             {/* If iconfont, we might want to show it on white for clarity as per prompt logic, or transparent. 
                 Using a checkered background helps visualize transparency. */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white/5">
              <img 
                src={`data:image/png;base64,${icon.base64}`} 
                alt="Generated Icon" 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
            
            {/* PNG Download */}
            <button
              onClick={() => handleDownloadPng(icon)}
              className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs hover:bg-gray-200 transition-colors w-full justify-center"
            >
              {downloadedId === icon.id ? <Check size={14} /> : <ImageIcon size={14} />}
              <span>下载 PNG</span>
            </button>

            {/* SVG Download */}
            <button
              onClick={() => handleDownloadSvg(icon)}
              disabled={convertingId === icon.id}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-purple-500 transition-colors w-full justify-center"
            >
              {convertingId === icon.id ? (
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
              ) : downloadedId === icon.id + '_svg' ? (
                <Check size={14} />
              ) : (
                <FileCode size={14} />
              )}
              <span>{convertingId === icon.id ? '转换中...' : '转矢量 SVG'}</span>
            </button>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid;