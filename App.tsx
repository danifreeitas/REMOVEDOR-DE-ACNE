
import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setProcessedImageUrl(null);
    setError(null);
  };

  const handleRemoveAcne = useCallback(async () => {
    if (!originalImageFile) {
      setError("Por favor, carregue uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImageUrl(null);

    try {
      const resultImageUrl = await editImageWithGemini(originalImageFile);
      setProcessedImageUrl(resultImageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Removedor de Acne com IA
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Carregue uma foto e deixe a IA fazer a mágica para uma pele mais lisa.
        </p>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col items-center">
        <div className="w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 space-y-6">
          <ImageUploader onImageChange={handleImageChange} currentImageUrl={originalImageUrl} />
          
          {error && <p className="text-red-400 text-center font-medium bg-red-900/30 border border-red-700 p-3 rounded-lg">{error}</p>}

          <div className="flex justify-center">
            <button
              onClick={handleRemoveAcne}
              disabled={!originalImageFile || isLoading}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Processando...' : 'Remover Acne'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 text-center">
            <Spinner />
            <p className="mt-4 text-gray-400">A IA está trabalhando... Isso pode levar um momento.</p>
          </div>
        )}

        {processedImageUrl && (
          <ResultDisplay
            originalImageUrl={originalImageUrl!}
            processedImageUrl={processedImageUrl}
          />
        )}
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-12 py-4 border-t border-gray-700">
          <p className="text-gray-500">
              Desenvolvido com React, Tailwind CSS e Gemini API.
          </p>
      </footer>
    </div>
  );
};

export default App;
