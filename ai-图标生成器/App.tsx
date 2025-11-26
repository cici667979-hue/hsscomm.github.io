import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import ResultsGrid from './components/ResultsGrid';
import { IconStyle, GeneratedIcon } from './types';
import { generateIcons } from './services/geminiService';
import { downloadZip } from './utils/imageUtils';
import { Sparkles, DownloadCloud } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<IconStyle>(IconStyle.CLAY_3D);
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedIcons([]); // Clear previous results immediately or keep them? Let's clear for new batch.

    try {
      const images = await generateIcons(prompt, style, count);
      
      const newIcons: GeneratedIcon[] = images.map((base64, index) => ({
        id: Date.now().toString() + index,
        base64,
        prompt,
        style,
      }));

      setGeneratedIcons(newIcons);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("生成失败，请检查网络或 API Key");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchDownload = async () => {
    if (generatedIcons.length === 0) return;
    try {
      await downloadZip(generatedIcons);
    } catch (e) {
      console.error(e);
      alert("打包下载失败");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-x-hidden text-slate-100">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[100px]"></div>
      </div>

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md mb-4">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-xs font-semibold text-white/80 tracking-wider uppercase">AI Powered Design Tool</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
            AI 图标生成器
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            一键生成 3D、扁平化或 Iconfont 风格的专业图标，支持自动矢量化与批量导出。
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit z-20">
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              style={style}
              setStyle={setStyle}
              count={count}
              setCount={setCount}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
            {generatedIcons.length > 0 && (
              <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-sm text-white/70">
                  成功生成 <span className="text-white font-bold">{generatedIcons.length}</span> 个图标
                </div>
                <button
                  onClick={handleBatchDownload}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all"
                >
                  <DownloadCloud size={16} />
                  <span>批量打包下载 (PNG + SVG)</span>
                </button>
              </div>
            )}

            <div className="min-h-[400px]">
               {isGenerating && generatedIcons.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-[400px] text-white/30 space-y-4 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                   <div className="animate-pulse">
                     <Sparkles size={48} />
                   </div>
                   <p className="font-light">AI 正在构思您的创意...</p>
                 </div>
               ) : generatedIcons.length > 0 ? (
                 <ResultsGrid icons={generatedIcons} />
               ) : (
                 <div className="flex flex-col items-center justify-center h-[400px] text-white/20 border-2 border-dashed border-white/10 rounded-3xl">
                   <p className="text-lg font-light">在左侧输入描述，开始创作</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-white/20 text-sm">
        <p>&copy; 2024 AI Icon Generator. Powered by Google Gemini Imagen.</p>
      </footer>
    </div>
  );
};

export default App;