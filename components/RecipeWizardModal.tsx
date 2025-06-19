
import React, { useState, useCallback } from 'react';
import { DaneKreatora } from '../types';
import { PROFIL_SMAKU_OPCJE, ZLOZONOSC_OPCJE, TEMPERATURA_DANIA_OPCJE } from '../constants';

interface RecipeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DaneKreatora) => void;
}

const initialDaneKreatora: DaneKreatora = {
  coLubisz: '',
  poziomGłodu: 3,
  temperaturaDania: 'Ciepłe',
  profilSmaku: 'Słone',
  zlozonosc: 'Średniozaawansowane',
  maxCzasPrzygotowania: 60,
};

export const RecipeWizardModal: React.FC<RecipeWizardModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [dane, setDane] = useState<DaneKreatora>(initialDaneKreatora);
  const [krok, setKrok] = useState(1);

  const handleChange = useCallback((field: keyof DaneKreatora, value: any) => {
    setDane(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = () => setKrok(prev => prev + 1);
  const handlePrev = () => setKrok(prev => prev - 1);

  const handleSubmit = () => {
    onSubmit(dane);
    setDane(initialDaneKreatora); // Reset for next time
    setKrok(1);
  };

  if (!isOpen) return null;

  const renderKrok = () => {
    switch (krok) {
      case 1:
        return (
          <div>
            <label htmlFor="coLubisz" className="block text-sm font-medium text-gray-300 mb-1">Co lubisz jeść? Jakie smaki, składniki preferujesz?</label>
            <textarea
              id="coLubisz"
              value={dane.coLubisz}
              onChange={(e) => handleChange('coLubisz', e.target.value)}
              rows={3}
              placeholder="Np. kuchnia włoska, pikantne dania, makaron, warzywa..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="poziomGłodu" className="block text-sm font-medium text-gray-300 mb-1">Jak bardzo jesteś głodny/a? (0 - wcale, 6 - bardzo)</label>
            <input
              type="range"
              id="poziomGłodu"
              min="0"
              max="6"
              value={dane.poziomGłodu}
              onChange={(e) => handleChange('poziomGłodu', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="text-center text-gray-400 mt-1">{dane.poziomGłodu}</div>
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Danie ciepłe czy zimne?</label>
            {TEMPERATURA_DANIA_OPCJE.map(opcja => (
              <label key={opcja} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="temperaturaDania"
                  value={opcja}
                  checked={dane.temperaturaDania === opcja}
                  onChange={(e) => handleChange('temperaturaDania', e.target.value as 'Ciepłe' | 'Zimne')}
                  className="form-radio h-4 w-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-300">{opcja}</span>
              </label>
            ))}
          </div>
        );
      case 4:
        return (
          <div>
            <label htmlFor="profilSmaku" className="block text-sm font-medium text-gray-300 mb-1">Preferowany profil smaku?</label>
            <select
              id="profilSmaku"
              value={dane.profilSmaku}
              onChange={(e) => handleChange('profilSmaku', e.target.value as DaneKreatora['profilSmaku'])}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {PROFIL_SMAKU_OPCJE.map(opcja => (
                <option key={opcja} value={opcja}>{opcja}</option>
              ))}
            </select>
          </div>
        );
      case 5:
        return (
          <div>
            <label htmlFor="zlozonosc" className="block text-sm font-medium text-gray-300 mb-1">Stopień skomplikowania przepisu?</label>
             <select
              id="zlozonosc"
              value={dane.zlozonosc}
              onChange={(e) => handleChange('zlozonosc', e.target.value as DaneKreatora['zlozonosc'])}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {ZLOZONOSC_OPCJE.map(opcja => (
                <option key={opcja} value={opcja}>{opcja}</option>
              ))}
            </select>
          </div>
        );
      case 6:
        return (
          <div>
            <label htmlFor="maxCzasPrzygotowania" className="block text-sm font-medium text-gray-300 mb-1">Maksymalny czas przygotowania (w minutach)?</label>
            <input
              type="number"
              id="maxCzasPrzygotowania"
              value={dane.maxCzasPrzygotowania}
              onChange={(e) => handleChange('maxCzasPrzygotowania', parseInt(e.target.value))}
              min="5"
              step="5"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const totalKrokow = 6;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-green-400">Kreator Przepisu (Krok {krok}/{totalKrokow})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 min-h-[100px]">
          {renderKrok()}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(krok / totalKrokow) * 100}%` }}></div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={krok === 1}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md disabled:opacity-50"
          >
            Wstecz
          </button>
          {krok < totalKrokow ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Dalej
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
            >
              Generuj Przepis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
