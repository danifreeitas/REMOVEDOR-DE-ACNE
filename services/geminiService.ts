
import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Fallback for ArrayBuffer
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        resolve(window.btoa(binary));
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


export const editImageWithGemini = async (imageFile: File): Promise<string> => {
  // Assume process.env.API_KEY is available
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const imagePart = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        {
          text: 'Remova todas as acnes, espinhas e manchas do rosto nesta foto. Faça a pele parecer lisa e natural, preservando a textura e o tom originais da pele. Não altere outras características faciais.',
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts?.[0];

  if (firstPart && firstPart.inlineData) {
    const base64ImageBytes: string = firstPart.inlineData.data;
    const mimeType = firstPart.inlineData.mimeType;
    return `data:${mimeType};base64,${base64ImageBytes}`;
  } else {
    throw new Error("Não foi possível processar a imagem. A resposta da API estava em um formato inesperado.");
  }
};