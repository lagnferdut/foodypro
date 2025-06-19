
import React, { useRef } from 'react';
import { OptionGroup } from './OptionGroup';

interface ImageUploadProps {
  zdjecia: File[];
  onImageUpload: (files: FileList | null) => void;
  onImageRemove: (index: number) => void;
  onGenerateFromImages?: (() => void) | null; // Made optional/nullable
  isLoading: boolean;
  maxZdjec: number;
  showGenerateButton?: boolean; // New prop
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  zdjecia,
  onImageUpload,
  onImageRemove,
  onGenerateFromImages,
  isLoading,
  maxZdjec,
  showGenerateButton = true, // Default to true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(event.target.files);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <OptionGroup title={`Dodaj Zdjęcia (max ${maxZdjec})`}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        id="imageUploadInput"
        disabled={isLoading || zdjecia.length >= maxZdjec}
      />
      <label
        htmlFor="imageUploadInput"
        className={`w-full text-center p-3 rounded-md transition-colors duration-150 ease-in-out cursor-pointer
                    ${isLoading || zdjecia.length >= maxZdjec 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {zdjecia.length >= maxZdjec ? `Osiągnięto limit ${maxZdjec} zdjęć` : 'Wybierz zdjęcia...'}
      </label>

      {zdjecia.length > 0 && (
        <div className="mt-3 space-y-2">
          {zdjecia.map((plik, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-600 rounded-md">
              <span className="text-sm truncate w-4/5">{plik.name}</span>
              <button
                onClick={() => onImageRemove(index)}
                disabled={isLoading}
                className="text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {showGenerateButton && onGenerateFromImages && (
            <button
              onClick={onGenerateFromImages}
              disabled={isLoading || zdjecia.length === 0}
              className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generuj z obrazów
            </button>
          )}
        </div>
      )}
    </OptionGroup>
  );
};
