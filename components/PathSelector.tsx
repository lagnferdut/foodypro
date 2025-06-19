import React from 'react';
import { RecipeGenerationPath } from '../types';

interface PathSelectorProps {
  currentPath: RecipeGenerationPath;
  setCurrentPath: (path: RecipeGenerationPath) => void;
}

const PathButton: React.FC<{
  path: RecipeGenerationPath;
  currentPath: RecipeGenerationPath;
  onClick: () => void;
  title: string;
  description: string;
  icon: JSX.Element;
}> = ({ path, currentPath, onClick, title, description, icon }) => {
  const isActive = currentPath === path;
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-4 md:p-6 rounded-xl 
        transition-all duration-300 ease-in-out transform hover:scale-105
        border-2 
        ${isActive 
          ? 'bg-green-600 border-green-400 shadow-green-500/40 shadow-lg text-white' 
          : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'}
      `}
    >
      <div className={`mb-2 md:mb-3 text-3xl md:text-4xl ${isActive ? 'text-white' : 'text-green-400'}`}>{icon}</div>
      <h3 className="text-md md:text-lg font-semibold mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-center ${isActive ? 'text-green-100' : 'text-gray-400'}">{description}</p>
    </button>
  );
};

export const PathSelector: React.FC<PathSelectorProps> = ({ currentPath, setCurrentPath }) => {
  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-xl shadow-2xl mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-center text-green-400 mb-4 md:mb-6">
        Wybierz sposób tworzenia przepisu:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <PathButton
          path="main_search"
          currentPath={currentPath}
          onClick={() => setCurrentPath('main_search')}
          title="Główne Wyszukiwanie"
          description="Wpisz, na co masz ochotę."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
        />
        <PathButton
          path="detailed_filters"
          currentPath={currentPath}
          onClick={() => setCurrentPath('detailed_filters')}
          title="Dostosuj przepis"
          description="Pora dnia, kuchnia, kalorie, składniki."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>}
        />
        <PathButton
          path="wizard"
          currentPath={currentPath}
          onClick={() => setCurrentPath('wizard')}
          title="Kreator 6-Krokowy"
          description="Odpowiedz na kilka pytań."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5M9 12h3.75" /></svg>}
        />
        <PathButton
          path="occasion"
          currentPath={currentPath}
          onClick={() => setCurrentPath('occasion')}
          title="Gotuj na okazję"
          description="Wybierz okazję, my zajmiemy się resztą."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z" /></svg>}
        />
      </div>
    </div>
  );
};