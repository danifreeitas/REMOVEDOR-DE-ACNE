
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  currentImageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, currentImageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full aspect-video border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50 transition-all duration-300"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
      ) : (
        <div className="space-y-2 text-gray-400">
          <UploadIcon className="mx-auto h-12 w-12" />
          <h3 className="text-lg font-semibold text-gray-200">Clique para carregar uma imagem</h3>
          <p className="text-sm">ou arraste e solte</p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
