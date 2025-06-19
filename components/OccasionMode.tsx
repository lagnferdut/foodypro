import React from 'react';
import { Okazja } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface OccasionModeProps {
  occasions: Okazja[];
  selectedOccasion: Okazja | null;
  onSelectOccasion: (okazja: Okazja | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const OccasionMode: React.FC<OccasionModeProps> = ({
  occasions,
  selectedOccasion,
  onSelectOccasion,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl mt-6">
      <h3 className="text-xl font-semibold text-green-400 mb-4 text-center">Przepis na Okazję 🎉</h3>
      <p className="text-gray-300 mb-1 text-center">Wybierz okazję, a my znajdziemy idealny przepis:</p>
      
      <div className="mb-4">
        <select
          value={selectedOccasion ? selectedOccasion.id : ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const okazja = occasions.find(o => o.id === selectedId) || null;
            onSelectOccasion(okazja);
          }}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
          disabled={isLoading}
        >
          <option value="">-- Wybierz okazję --</option>
          {occasions.map(okazja => (
            <option key={okazja.id} value={okazja.id}>{okazja.nazwa}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !selectedOccasion}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : `Generuj na ${selectedOccasion ? selectedOccasion.nazwa : 'Okazję'}`}
      </button>
    </div>
  );
};
