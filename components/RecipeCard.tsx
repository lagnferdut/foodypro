
import React, { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types';
import { CopyButton } from './CopyButton';
import { LoadingSpinner } from './LoadingSpinner';
import { GeminiService } from '../services/geminiService';

interface RecipeCardProps {
  przepis: Recipe;
  geminiServiceInstance: GeminiService | null;
}

const CalorieTooltip: React.FC<{ skladnikiKalorie: NonNullable<Recipe['skladnikiKalorie']> }> = ({ skladnikiKalorie }) => {
  if (!skladnikiKalorie || skladnikiKalorie.length === 0) return null;
  return (
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-xs sm:max-w-sm md:max-w-md 
                 p-3 bg-gradient-to-br from-gray-700 to-gray-800 border border-teal-600 
                 text-white text-xs rounded-xl shadow-2xl z-20 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    >
      <h4 className="font-semibold text-green-400 mb-1.5 text-sm">Rozkład kalorii:</h4>
      <ul className="list-disc list-inside pl-1 space-y-1">
        {skladnikiKalorie.map((sk, idx) => (
          <li key={idx} className="text-gray-200">
            <span className="font-medium text-gray-100">{sk.nazwa}</span>: {sk.kalorie} kcal ({sk.porcja})
          </li>
        ))}
      </ul>
      {/* Arrow pointing down to the element */}
      <div 
        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                   border-l-[10px] border-l-transparent 
                   border-r-[10px] border-r-transparent 
                   border-t-[10px] border-t-gray-700" // Arrow color matches darker part of gradient
      ></div>
    </div>
  );
};


const DetailItem: React.FC<{ label: string; value: React.ReactNode; icon?: string; className?: string, children?: React.ReactNode }> = ({ label, value, icon, className = '', children }) => (
  <div className={`flex items-start ${className}`}>
    {icon && <span className="mr-2 text-green-400 text-xl">{icon}</span>}
    <div className="relative group"> {/* Added relative and group for tooltip */}
      <span className="font-semibold text-gray-300">{label}:</span>
      <span className="ml-1 text-gray-200">{value}</span>
      {children} {/* For tooltip */}
    </div>
  </div>
);


export const RecipeCard: React.FC<RecipeCardProps> = ({ przepis, geminiServiceInstance }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(przepis.aiGeneratedImageBase64 || null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const fetchAiImage = useCallback(async () => {
    if (!geminiServiceInstance || !przepis.nazwa || aiGeneratedImage) return;

    setIsImageLoading(true);
    setImageError(null);
    try {
      // Pass the existing image to avoid re-generation if already set on recipe object
      if (przepis.aiGeneratedImageBase64) {
          setAiGeneratedImage(przepis.aiGeneratedImageBase64);
          return;
      }
      const imageUrl = await geminiServiceInstance.generateImageForRecipe(przepis.nazwa, przepis.opis);
      setAiGeneratedImage(imageUrl);
      // TODO: Consider a way to update the recipe object in the parent state (App.tsx)
      // For now, this component manages its own image state after initial load.
      // One option: a callback prop like `onImageGenerated(recipeId, imageUrl)`
      // For simplicity here, we assume if `przepis.aiGeneratedImageBase64` is provided, it's used.
    } catch (error: any) {
      console.error("Błąd generowania obrazka AI:", error);
      setImageError("Nie udało się załadować obrazka AI.");
    } finally {
      setIsImageLoading(false);
    }
  }, [geminiServiceInstance, przepis.nazwa, przepis.opis, aiGeneratedImage, przepis.aiGeneratedImageBase64]);

  useEffect(() => {
    if (przepis.aiGeneratedImageBase64) {
        setAiGeneratedImage(przepis.aiGeneratedImageBase64);
    } else if (!aiGeneratedImage && geminiServiceInstance) {
        fetchAiImage();
    }
  }, [przepis, geminiServiceInstance, fetchAiImage, aiGeneratedImage]);


  const recipeToText = () => {
    let text = `Nazwa: ${przepis.nazwa}\n`;
    text += `Opis: ${przepis.opis}\n\n`;
    text += `Składniki:\n`;
    przepis.skladniki.forEach(s => {
      text += `- ${s.nazwa}: ${s.ilosc}\n`;
    });
    text += `\nInstrukcje:\n`;
    przepis.instrukcje.split('\n').filter(line => line.trim() !== '').forEach(line => {
        text += `${line}\n`;
    });
    text += `\nKalorie: ${przepis.kalorie} kcal\n`;
    text += `Makroskładniki: Białko: ${przepis.makroskladniki.bialko}, Tłuszcze: ${przepis.makroskladniki.tluszcze}, Węglowodany: ${przepis.makroskladniki.weglowodany}\n`;
    text += `Typ kuchni: ${przepis.typKuchni}\n`;
    text += `Stopień trudności: ${przepis.stopienTrudnosci}\n`;
    text += `Czas przygotowania: ${przepis.czasPrzygotowania}\n`;
    text += `Pora dnia: ${przepis.poraDnia}\n`;
    if (przepis.wymaganeUrzadzenia?.length > 0) {
      text += `Wymagane urządzenia: ${przepis.wymaganeUrzadzenia.join(', ')}\n`;
    }
    if (przepis.ostrzezeniaAlergenow?.length > 0) {
      text += `Alergeny: ${przepis.ostrzezeniaAlergenow.join(', ')}\n`;
    }
    if (przepis.skladnikiKalorie && przepis.skladnikiKalorie.length > 0) {
        text += `\nRozkład kalorii (główne składniki):\n`;
        przepis.skladnikiKalorie.forEach(sk => {
            text += `- ${sk.nazwa}: ${sk.kalorie} kcal (${sk.porcja})\n`;
        });
    }
    return text;
  };


  return (
    <article className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-green-500/30">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold text-green-400 mb-3">{przepis.nazwa}</h2>
          <CopyButton textToCopy={recipeToText()} />
        </div>
        <p className="text-gray-300 mb-4 italic">{przepis.opis}</p>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-teal-400 hover:text-teal-300 mb-4 flex items-center"
          aria-expanded={showDetails}
          aria-controls={`recipe-details-${przepis.nazwa.replace(/\s/g, '-')}`}
        >
          {showDetails ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ml-1 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {showDetails && (
          <div id={`recipe-details-${przepis.nazwa.replace(/\s/g, '-')}`}>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
              <DetailItem label="Kalorie" value={`${przepis.kalorie} kcal`} icon="🔥">
                {przepis.skladnikiKalorie && przepis.skladnikiKalorie.length > 0 && (
                  <CalorieTooltip skladnikiKalorie={przepis.skladnikiKalorie} />
                )}
              </DetailItem>
              <DetailItem label="Białko" value={przepis.makroskladniki.bialko} icon="💪" />
              <DetailItem label="Tłuszcze" value={przepis.makroskladniki.tluszcze} icon="🥑" />
              <DetailItem label="Węglowodany" value={przepis.makroskladniki.weglowodany} icon="🍞" />
              <DetailItem label="Typ kuchni" value={przepis.typKuchni} icon="🌍" />
              <DetailItem label="Trudność" value={przepis.stopienTrudnosci} icon="📊" />
              <DetailItem label="Czas" value={przepis.czasPrzygotowania} icon="⏱️" />
              <DetailItem label="Pora dnia" value={przepis.poraDnia} icon="☀️" />
              {przepis.wymaganeUrzadzenia?.length > 0 && (
                <DetailItem label="Urządzenia" value={przepis.wymaganeUrzadzenia.join(', ')} icon="🍳" />
              )}
              {przepis.ostrzezeniaAlergenow?.length > 0 && (
                <DetailItem label="Alergeny" value={przepis.ostrzezeniaAlergenow.join(', ')} icon="⚠️" />
              )}
            </div>
          
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-300 mb-2">Składniki:</h3>
              <ul className="list-disc list-inside pl-2 space-y-1 text-gray-200">
                {przepis.skladniki.map((skladnik, i) => (
                  <li key={i}><span className="font-medium">{skladnik.nazwa}</span>: {skladnik.ilosc}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">Instrukcje:</h3>
              <div className="prose prose-sm prose-invert max-w-none text-gray-200">
                {przepis.instrukcje.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                  const match = line.match(/^(\d+\.?)\s*(.*)/); // Adjusted regex for optional dot
                  if (match) {
                    return <p key={index} className="mb-3"><strong className="text-green-300">{match[1]}</strong> {match[2]}</p>;
                  }
                  return <p key={index} className="mb-3">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
       <div className="px-6 py-4 bg-gray-700/50 min-h-[200px] flex items-center justify-center"> {/* Increased min-h for image */}
        {isImageLoading && (
          <div className="text-center">
            <LoadingSpinner size="lg" /> {/* Larger spinner */}
            <p className="text-md text-gray-300 mt-3">Ładowanie apetycznego obrazka AI...</p>
          </div>
        )}
        {imageError && !isImageLoading && (
           <div className="text-center text-red-400">
            <p className="text-lg">{imageError}</p>
            <p className="text-sm">Wyświetlanie domyślnego obrazka.</p>
            <img 
                src={`https://source.unsplash.com/random/600x300/?food,${przepis.nazwa.split(" ")[0] || 'meal'}`} 
                alt={`Domyślny obrazek dla ${przepis.nazwa}`} 
                className="w-full h-40 object-cover rounded-md opacity-75 mt-2"
                onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
          </div>
        )}
        {!isImageLoading && !imageError && aiGeneratedImage && (
          <img 
            src={aiGeneratedImage} 
            alt={`Wygenerowany przez AI obraz dla: ${przepis.nazwa}`} 
            className="w-full max-h-80 object-contain rounded-lg shadow-lg" // max-h increased, better styling
          />
        )}
        {/* Fallback if AI image is null and not loading and no error (e.g., initial state without fetch yet, or if fetchAiImage was skipped) */}
        {!isImageLoading && !imageError && !aiGeneratedImage && (
             <img 
                src={`https://source.unsplash.com/random/600x300/?${przepis.typKuchni || 'food'},${przepis.nazwa.split(" ")[0] || 'meal'}`} 
                alt={`Domyślny obrazek dla ${przepis.nazwa}`} 
                className="w-full h-40 object-cover rounded-md opacity-75"
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
        )}
      </div>
    </article>
  );
};
