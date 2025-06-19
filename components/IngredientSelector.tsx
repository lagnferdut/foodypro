import React, { useState } from 'react';
import { Skladnik } from '../types';
import { OptionGroup } from './OptionGroup';

interface IngredientSelectorProps {
  wszystkieSkladniki: Skladnik[];
  wybraneSkladniki: Skladnik[];
  onIngredientToggle: (skladnik: Skladnik) => void;
  maxSkladnikow: number;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  wszystkieSkladniki,
  wybraneSkladniki,
  onIngredientToggle,
  maxSkladnikow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false); // Initially show a limited number

  const filteredSkladniki = wszystkieSkladniki.filter(s =>
    s.nazwa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display 10 ingredients initially, or all if "showAll" is true or total is less than 10
  const displayedSkladniki = showAll || filteredSkladniki.length <= 10 ? filteredSkladniki : filteredSkladniki.slice(0, 10);
  const limitReached = wybraneSkladniki.length >= maxSkladnikow;

  return (
    <OptionGroup title={`Wybierz Składniki (${wybraneSkladniki.length}/${maxSkladnikow})`}>
      <input
        type="text"
        placeholder="Szukaj składnika..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 mb-2"
      />
      {/* Removed max-h-60 and custom-scrollbar from this div */}
      <div className="space-y-2 pr-2"> 
        {displayedSkladniki.map(skladnik => {
          const isSelected = wybraneSkladniki.some(s => s.id === skladnik.id);
          const isDisabled = limitReached && !isSelected;
          return (
            <button
              key={skladnik.id}
              onClick={() => onIngredientToggle(skladnik)}
              disabled={isDisabled}
              className={`w-full text-left p-2 rounded-md transition-all duration-200 ease-in-out flex items-center justify-between
                ${isSelected 
                  ? 'bg-green-500 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-600 hover:bg-gray-500'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              <span className="flex items-center">
                <span className="text-xl mr-2">{skladnik.piktogram}</span>
                {skladnik.nazwa}
              </span>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {filteredSkladniki.length > 10 && !showAll && (
        <button 
          onClick={() => setShowAll(true)}
          className="text-sm text-teal-400 hover:text-teal-300 mt-2"
        >
          Pokaż więcej ({filteredSkladniki.length - 10})
        </button>
      )}
      {showAll && filteredSkladniki.length > 10 && ( // Only show "Pokaż mniej" if more than 10 and all are shown
         <button 
          onClick={() => setShowAll(false)}
          className="text-sm text-teal-400 hover:text-teal-300 mt-2"
        >
          Pokaż mniej
        </button>
      )}
      {limitReached && (
        <p className="text-xs text-yellow-400 mt-1">Osiągnięto maksymalną liczbę składników ({maxSkladnikow}).</p>
      )}
    </OptionGroup>
  );
};