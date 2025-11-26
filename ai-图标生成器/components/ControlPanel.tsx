import React from 'react';
import { IconStyle } from '../types';
import { Layers, Box, PenTool } from 'lucide-react';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (v: string) => void;
  style: IconStyle;
  setStyle: (v: IconStyle) => void;
  count: number;
  setCount: (v: number) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  style,
  setStyle,
  count,
  setCount,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-white text-sm font-semibold tracking-wide uppercase opacity-80">
          图标描述
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：一只戴着宇航员头盔的可爱的猫..."
          className="w-full bg-black/20 text-white placeholder-white/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all h-28 resize-none text-base"
        />
      </div>

      {/* Style Selector */}
      <div className="space-y-3">
        <label className="text-white text-sm font-semibold tracking-wide uppercase opacity-80">
          设计风格
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setStyle(IconStyle.CLAY_3D)}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200 ${
              style === IconStyle.CLAY_3D
                ? 'bg-purple-500/80 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <Box size={18} />
            <span>3D 粘土</span>
          </button>
          
          <button
            onClick={() => setStyle(IconStyle.FLAT)}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200 ${
              style === IconStyle.FLAT
                ? 'bg-blue-500/80 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <Layers size={18} />
            <span>扁平化</span>
          </button>

          <button
            onClick={() => setStyle(IconStyle.ICONFONT)}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200 ${
              style === IconStyle.ICONFONT
                ? 'bg-zinc-600/80 border-zinc-400 text-white shadow-lg shadow-zinc-500/20'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <PenTool size={18} />
            <span>Iconfont</span>
          </button>
        </div>
      </div>

      {/* Count Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-white">
          <label className="text-sm font-semibold tracking-wide uppercase opacity-80">
            生成数量
          </label>
          <span className="text-sm font-bold bg-white/10 px-2 py-1 rounded-md min-w-[30px] text-center">
            {count}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
        />
        <div className="flex justify-between text-xs text-white/40 px-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg tracking-wide shadow-xl transition-all duration-300 transform 
          ${isGenerating || !prompt.trim()
            ? 'bg-gray-600/50 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-[1.02] hover:shadow-purple-500/25 active:scale-[0.98]'
          }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在绘制灵感...</span>
          </span>
        ) : (
          "立即生成"
        )}
      </button>
    </div>
  );
};

export default ControlPanel;