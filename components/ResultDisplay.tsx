import React, { useState, useRef } from 'react';
import { DownloadIcon } from './Icons';

interface ResultDisplayProps {
  originalImageUrl: string;
  processedImageUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImageUrl, processedImageUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImageUrl;
    
    // Extrai a extensão do arquivo a partir do mime type do base64
    const mimeType = processedImageUrl.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'png';

    link.download = `rosto-tratado.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let newPosition = (x / rect.width) * 100;
    
    if (newPosition < 0) newPosition = 0;
    if (newPosition > 100) newPosition = 100;

    setSliderPosition(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const handleMouseMove = (moveEvent: MouseEvent) => {
        handleMove(moveEvent.clientX);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const handleTouchMove = (moveEvent: TouchEvent) => {
        handleMove(moveEvent.touches[0].clientX);
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="w-full max-w-5xl mt-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center sm:text-left">
          Compare o Resultado
        </h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Baixar Imagem</span>
        </button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div 
            ref={containerRef} 
            className="relative w-full max-w-2xl mx-auto aspect-square rounded-xl overflow-hidden select-none cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
          {/* Original Image (Bottom Layer) */}
          <img
            src={originalImageUrl}
            alt="Original"
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
          {/* Processed Image (Top Layer, clipped) */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
           >
            <img
              src={processedImageUrl}
              alt="Processada"
              className="absolute top-0 left-0 w-full h-full object-contain"
              draggable={false}
            />
           </div>
          
          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/75 pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center ring-2 ring-indigo-500 cursor-ew-resize">
              <svg className="w-6 h-6 text-gray-700 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl px-4">
           <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
            aria-label="Comparar imagens"
           />
        </div>
        <div className="w-full max-w-2xl flex justify-between text-sm text-gray-400 px-4">
            <span>Original</span>
            <span>Processada</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;