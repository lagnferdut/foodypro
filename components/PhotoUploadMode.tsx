
import React from 'react';
import { ImageUpload } from './ImageUpload';
import { LoadingSpinner } from './LoadingSpinner';

interface PhotoUploadModeProps {
  zdjecia: File[];
  onImageUpload: (files: FileList | null) => void;
  onImageRemove: (index: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  maxZdjec: number;
}

export const PhotoUploadMode: React.FC<PhotoUploadModeProps> = ({
  zdjecia,
  onImageUpload,
  onImageRemove,
  onGenerate,
  isLoading,
  maxZdjec,
}) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl mt-6">
      <h3 className="text-xl font-semibold text-green-400 mb-2 text-center">Przepis ze Zdjęć 🖼️</h3>
      <p className="text-gray-300 mb-4 text-center">
        Wstaw maksymalnie {maxZdjec} zdjęcia, np. zawartości Twojej lodówki, a AI zaproponuje przepis!
      </p>
      
      <ImageUpload
        zdjecia={zdjecia}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
        onGenerateFromImages={null} // Przekazujemy null, aby ukryć wewnętrzny przycisk ImageUpload
        isLoading={isLoading}
        maxZdjec={maxZdjec}
        showGenerateButton={false} // Jawnie ukrywamy przycisk w komponencie ImageUpload
      />

      {zdjecia.length > 0 && (
        <button
          onClick={onGenerate}
          disabled={isLoading || zdjecia.length === 0}
          className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Generuj Przepis ze Zdjęć'}
        </button>
      )}
    </div>
  );
};
