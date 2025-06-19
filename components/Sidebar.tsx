import React from 'react';
import { OpcjeZaawansowane, Skladnik, PoraDnia, TypKuchni as TypKuchniInterface } from '../types';
import { IngredientSelector } from './IngredientSelector';
import { ImageUpload } from './ImageUpload';
import { OptionGroup } from './OptionGroup';
import { LoadingSpinner } from './LoadingSpinner';

interface DetailedFiltersPanelProps {
  isOpen: boolean;
  togglePanel: () => void;
  opcje: OpcjeZaawansowane;
  onOptionChange: <K extends keyof OpcjeZaawansowane>(option: K, value: OpcjeZaawansowane[K]) => void;
  wszystkieSkladniki: Skladnik[];
  onIngredientToggle: (skladnik: Skladnik) => void;
  onImageUpload: (files: FileList | null) => void;
  onImageRemove: (index: number) => void;
  onGenerateFromImages: () => void; // This might be triggered from here if an image is the primary driver
  isLoading: boolean;
  maxSkladnikow: number;
  maxZdjec: number;
  poryDniaOpcje: Array<{ value: PoraDnia; label: string }>;
  typyKuchniOpcje: TypKuchniInterface[]; // Original list for fallback or direct selection
  kitchenTypeSuggestions: TypKuchniInterface[];
  onKitchenQueryChange: (query: string) => void;
  onKitchenSuggestionClick: (kitchen: TypKuchniInterface) => void;
  isKitchenSuggesting: boolean;
  onGenerate: () => void; // The main generate button for this panel
}

export const DetailedFiltersPanel: React.FC<DetailedFiltersPanelProps> = ({
  isOpen,
  togglePanel,
  opcje,
  onOptionChange,
  wszystkieSkladniki,
  onIngredientToggle,
  onImageUpload,
  onImageRemove,
  onGenerateFromImages, // Keep if image-specific generation is needed from here
  isLoading,
  maxSkladnikow,
  maxZdjec,
  poryDniaOpcje,
  // typyKuchniOpcje, // Not directly used if we rely on query and suggestions
  kitchenTypeSuggestions,
  onKitchenQueryChange,
  onKitchenSuggestionClick,
  isKitchenSuggesting,
  onGenerate
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={togglePanel}
        ></div>
      )}
      <aside 
        className={`fixed md:sticky top-0 md:top-[calc(64px+1rem)] h-screen md:h-auto 
                    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
                    transition-transform duration-300 ease-in-out 
                    w-full max-w-xs md:w-80 lg:w-96 bg-gray-800 shadow-xl p-6 z-40 
                    flex flex-col space-y-4 overflow-y-auto md:overflow-y-visible pb-24 md:pb-6 custom-scrollbar`}
      >
        <button
          onClick={togglePanel}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Zamknij panel filtrów"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-green-400 border-b border-gray-700 pb-2">Filtry Szczegółowe</h2>

        <OptionGroup title="Pora Dnia">
          <select
            value={opcje.poraDnia || ''}
            onChange={(e) => onOptionChange('poraDnia', e.target.value as PoraDnia)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          >
            <option value="">Wszystkie</option>
            {poryDniaOpcje.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </OptionGroup>

        <OptionGroup title="Typ Kuchni">
          <div className="relative">
            <input
              type="text"
              placeholder="Wpisz typ kuchni..."
              value={opcje.typKuchniQuery}
              onChange={(e) => onKitchenQueryChange(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            />
            {isKitchenSuggesting && <div className="absolute right-2 top-2"><LoadingSpinner size="sm" /></div>}
            {kitchenTypeSuggestions.length > 0 && !isKitchenSuggesting && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-600 border border-gray-500 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                {kitchenTypeSuggestions.map(k => (
                  <li key={k.id}>
                    <button
                      onClick={() => onKitchenSuggestionClick(k)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-500"
                    >
                      {k.nazwa}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </OptionGroup>


        <OptionGroup title={`Kalorie (${opcje.minKalorie} - ${opcje.maxKalorie} kcal)`}>
          <div className="space-y-2">
            <div>
              <label htmlFor="minKalorie" className="block text-sm font-medium text-gray-300">Min kcal</label>
              <input
                type="range" id="minKalorie" min="0" max="5000" step="50"
                value={opcje.minKalorie}
                onChange={(e) => onOptionChange('minKalorie', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="maxKalorie" className="block text-sm font-medium text-gray-300">Max kcal</label>
              <input
                type="range" id="maxKalorie" min="0" max="5000" step="50"
                value={opcje.maxKalorie}
                onChange={(e) => onOptionChange('maxKalorie', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                disabled={isLoading}
              />
            </div>
          </div>
        </OptionGroup>

        <IngredientSelector
          wszystkieSkladniki={wszystkieSkladniki}
          wybraneSkladniki={opcje.wybraneSkladniki}
          onIngredientToggle={onIngredientToggle}
          maxSkladnikow={maxSkladnikow}
        />

        <ImageUpload
          zdjecia={opcje.zdjecia}
          onImageUpload={onImageUpload}
          onImageRemove={onImageRemove}
          onGenerateFromImages={onGenerateFromImages} // This specific button might be for image-only generation
          isLoading={isLoading}
          maxZdjec={maxZdjec}
        />
        
        <div className="mt-auto pt-4 border-t border-gray-700">
             <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Generuj z Filtrów'}
            </button>
        </div>
      </aside>
    </>
  );
};
