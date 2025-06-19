import React from 'react';
import { Recipe, GroundingChunk, RecipeGenerationPath } from '../types';
import { RecipeCard } from './RecipeCard';
import { LoadingSpinner } from './LoadingSpinner';
import { GeminiService } from '../services/geminiService';

interface MainContentProps {
  zapytanie: string;
  setZapytanie: (value: string) => void;
  onSearch: () => void; 
  przepisy: Recipe[];
  isLoading: boolean;
  error: string | null;
  groundingChunks: GroundingChunk[];
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isSuggesting: boolean;
  geminiServiceInstance: GeminiService | null;
  currentPath: RecipeGenerationPath;
  activePathContentRenderer: () => React.ReactNode; 
}

export const MainContent: React.FC<MainContentProps> = ({
  zapytanie,
  setZapytanie,
  onSearch,
  przepisy,
  isLoading,
  error,
  groundingChunks,
  suggestions,
  onSuggestionClick,
  isSuggesting,
  geminiServiceInstance,
  currentPath,
  activePathContentRenderer,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(); 
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-900 md:ml-0 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Conditional Main Search Bar */}
        {currentPath === 'main_search' && (
          <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-2xl">
            <label htmlFor="search-query" className="block text-lg font-medium text-green-400 mb-2">
              Wpisz, na co masz ochotę 🍲
            </label>
            <div className="relative">
              <div className="flex space-x-3">
                <input
                  type="text"
                  id="search-query"
                  value={zapytanie}
                  onChange={(e) => setZapytanie(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Np. szybki obiad z kurczakiem, wegańskie ciasto..."
                  className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  onClick={onSearch}
                  disabled={isLoading || isSuggesting}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading && currentPath === 'main_search' ? <LoadingSpinner size="sm" /> : 'Szukaj'}
                </button>
              </div>
              {isSuggesting && (
                  <div className="absolute top-full left-0 right-0 mt-12 mr-28"> 
                      <div className="flex justify-center">
                          <LoadingSpinner size="sm" /> 
                          <span className="ml-2 text-sm text-gray-400">Szukam sugestii...</span>
                      </div>
                  </div>
              )}
              {suggestions.length > 0 && !isSuggesting && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20 overflow-hidden mr-[115px]">
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        onClick={() => onSuggestionClick(s)}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition-colors duration-150"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Specific Path UI (for Wizard and Occasion) */}
        {currentPath !== 'main_search' && currentPath !== 'detailed_filters' && (
          <div className="mb-6">
            {activePathContentRenderer()}
          </div>
        )}
        
        {/* General Error Display (moved from inside search bar) */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-50 text-red-400 text-sm rounded-md shadow">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <p className="ml-3 text-lg text-gray-300">Szukam inspiracji...</p>
          </div>
        )}

        {/* Initial Messages / Recipe Display */}
        {!isLoading && !error && (
          <>
            {przepisy.length === 0 && (
              <div className="text-center py-10">
                {currentPath === 'main_search' && zapytanie === '' && <p className="text-xl text-gray-400">Wpisz zapytanie powyżej lub wybierz inną metodę tworzenia przepisu!</p>}
                {currentPath === 'main_search' && zapytanie !== '' && <p className="text-xl text-gray-400">Brak wyników dla "{zapytanie}". Spróbuj inaczej lub zmień metodę.</p>}
                {currentPath === 'detailed_filters' && <p className="text-xl text-gray-400">Użyj panelu filtrów po lewej stronie, aby dostosować wyszukiwanie. Wyniki pojawią się tutaj.</p>}
                {(currentPath === 'wizard' || currentPath === 'occasion') && (
                     <p className="text-xl text-gray-400">Skonfiguruj opcje powyżej i naciśnij przycisk generowania, aby zobaczyć przepisy.</p>
                )}
              </div>
            )}
            {przepisy.length > 0 && (
              <div className="space-y-8 mt-6">
                {przepisy.map((przepis, index) => (
                  <RecipeCard 
                    key={`${przepis.nazwa}-${index}-${currentPath}`} 
                    przepis={przepis} 
                    geminiServiceInstance={geminiServiceInstance}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Źródła informacji (Google Search):</h3>
            <ul className="list-disc list-inside space-y-1">
              {groundingChunks.map((chunk, index) => {
                const source = chunk.web || chunk.retrievedContext;
                if (source?.uri) {
                  return (
                    <li key={index} className="text-sm">
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-teal-400 hover:text-teal-300 underline"
                      >
                        {source.title || source.uri}
                      </a>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
};