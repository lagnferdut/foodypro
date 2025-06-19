
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PoraDnia, Recipe, OpcjeZaawansowane, Skladnik, DaneKreatora, GroundingChunk, RecipeGenerationPath, Okazja, TypKuchni } from './types';
import { POPULARNE_SKLADNIKI, MAKSYMALNA_LICZBA_SKLADNIKOW, MAKSYMALNA_LICZBA_ZDJEC, PORY_DNIA_OPCJE, TYPY_KUCHNI, SYSTEM_INSTRUCTION_PL, APP_VERSION, POPULARNE_OKAZJE } from './constants';
import { DetailedFiltersPanel } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Logo } from './components/Logo';
import { Footer } from './components/Footer';
import { RecipeWizardModal } from './components/RecipeWizardModal';
import { PathSelector } from './components/PathSelector';
import { OccasionMode } from './components/OccasionMode';
import { generateRecipePrompt, generateRecipeFromWizardPrompt, generateRecipeFromImagesPrompt, generateSuggestionsPrompt, generateKitchenTypeSuggestionsPrompt, generateRecipeFromOccasionPrompt } from './services/promptService';
import { GeminiService } from './services/geminiService';

const App = (): JSX.Element => {
  const [zapytanie, setZapytanie] = useState<string>('');
  const [przepisy, setPrzepisy] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false); // For main search suggestions
  const [isKitchenSuggesting, setIsKitchenSuggesting] = useState<boolean>(false); // For kitchen type suggestions
  const [error, setError] = useState<string | null>(null);
  const [statusWiadomosc, setStatusWiadomosc] = useState<string>('Gotowy do działania!');
  
  const [currentPath, setCurrentPath] = useState<RecipeGenerationPath>('main_search');
  
  const [opcjeZaawansowane, setOpcjeZaawansowane] = useState<OpcjeZaawansowane>({
    minKalorie: 0,
    maxKalorie: 2000,
    wybraneSkladniki: [],
    zdjecia: [],
    typKuchniQuery: '', 
  });
  const [selectedOccasion, setSelectedOccasion] = useState<Okazja | null>(null);

  const [isDetailedFiltersPanelOpen, setIsDetailedFiltersPanelOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [geminiServiceInstance, setGeminiServiceInstance] = useState<GeminiService | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [kitchenTypeSuggestions, setKitchenTypeSuggestions] = useState<TypKuchni[]>([]);
  
  const suggestionTimeoutRef = useRef<number | null>(null);
  const kitchenSuggestionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      setGeminiServiceInstance(new GeminiService(apiKey));
      setStatusWiadomosc('Foody Pro połączony z AI. Gotowy do generowania przepisów!');
    } else {
      console.error("API Key for Gemini not found. Please set API_KEY environment variable.");
      setError("Nie znaleziono klucza API. Funkcje AI nie będą dostępne.");
      setStatusWiadomosc('Błąd: Klucz API Gemini (API_KEY) nie został znaleziony.');
    }
  }, []);

  const clearPreviousResults = () => {
    setPrzepisy([]);
    setGroundingChunks([]);
    setError(null);
  };

  const handleAdvancedOptionChange = useCallback(<K extends keyof OpcjeZaawansowane>(option: K, value: OpcjeZaawansowane[K]) => {
    setOpcjeZaawansowane(prev => ({ ...prev, [option]: value }));
    if (option === 'typKuchniQuery' && typeof value === 'string') {
        if(value === '') {
            setOpcjeZaawansowane(prev => ({ ...prev, typKuchni: undefined }));
        }
    }
  }, []);

  const performGeneration = useCallback(async (prompt: string, generationType: string) => {
    if (!geminiServiceInstance) {
      setError("Serwis Gemini nie jest zainicjalizowany. Sprawdź konfigurację API Key.");
      setStatusWiadomosc('Błąd: Serwis AI nie działa.');
      return;
    }
    setIsLoading(true);
    clearPreviousResults();
    setStatusWiadomosc(`Generowanie przepisu (${generationType})... 👨‍🍳`);

    try {
      const { recipes: fetchedRecipes, groundingMetadata } = await geminiServiceInstance.generateRecipes(prompt, SYSTEM_INSTRUCTION_PL);
      
      if (fetchedRecipes.length === 0) {
        setStatusWiadomosc('Nie znaleziono przepisów. Spróbuj inaczej! 🤔');
        setError('Nie udało się wygenerować przepisów.');
      } else {
        setPrzepisy(fetchedRecipes);
        setStatusWiadomosc(`Znaleziono ${fetchedRecipes.length} przepisów! Smacznego! 🍽️`);
      }
      if (groundingMetadata) setGroundingChunks(groundingMetadata);
    } catch (e: any) {
      console.error(`Błąd podczas generowania przepisu (${generationType}):`, e);
      setError(`Wystąpił błąd: ${e.message}. Spróbuj ponownie.`);
      setStatusWiadomosc('Coś poszło nie tak... 😥');
    } finally {
      setIsLoading(false);
    }
  }, [geminiServiceInstance]);

  const fetchKitchenTypeSuggestions = useCallback(async (query: string) => {
    if (!geminiServiceInstance || query.length < 1) {
      setKitchenTypeSuggestions([]);
      return;
    }
    setIsKitchenSuggesting(true);
    const filtered = TYPY_KUCHNI.filter(k => k.nazwa.toLowerCase().includes(query.toLowerCase()));
    setKitchenTypeSuggestions(filtered);
    setIsKitchenSuggesting(false);
  }, [geminiServiceInstance]);

  const handleKitchenQueryChange = (query: string) => {
    handleAdvancedOptionChange('typKuchniQuery', query);
    if (kitchenSuggestionTimeoutRef.current) clearTimeout(kitchenSuggestionTimeoutRef.current);
    if (query.length >= 1) {
      kitchenSuggestionTimeoutRef.current = window.setTimeout(() => fetchKitchenTypeSuggestions(query), 200);
    } else {
      setKitchenTypeSuggestions([]);
    }
  };

  const handleKitchenSuggestionClick = (kitchen: TypKuchni) => {
    handleAdvancedOptionChange('typKuchni', kitchen.id);
    handleAdvancedOptionChange('typKuchniQuery', kitchen.nazwa); 
    setKitchenTypeSuggestions([]);
  };

  const handleSearchFromMainQuery = (currentQuery?: string) => {
    const queryToUse = currentQuery || zapytanie;
    if (!queryToUse) {
      setError('Wpisz na co masz ochotę.');
      return;
    }
    const prompt = generateRecipePrompt(queryToUse, {}); 
    performGeneration(prompt, "wyszukiwanie główne");
  };
  
  const fetchMainSuggestions = useCallback(async (query: string) => {
    if (!geminiServiceInstance || query.length < 3) { 
      setSearchSuggestions([]);
      return;
    }
    setIsSuggesting(true);
    try {
      const prompt = generateSuggestionsPrompt(query);
      const suggestions = await geminiServiceInstance.generateSuggestions(prompt);
      setSearchSuggestions(suggestions);
    } catch (e: any) {
      console.error("Błąd podczas pobierania sugestii głównych:", e);
      setSearchSuggestions([]);
    } finally {
      setIsSuggesting(false);
    }
  }, [geminiServiceInstance]);

  const handleZapytanieChange = (newQuery: string) => {
    setZapytanie(newQuery);
    if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
    if (newQuery.length >= 3) {
      suggestionTimeoutRef.current = window.setTimeout(() => fetchMainSuggestions(newQuery), 300);
    } else {
      setSearchSuggestions([]);
    }
  };
  
  const handleMainSuggestionClick = (suggestion: string) => {
    setZapytanie(suggestion);
    setSearchSuggestions([]);
    handleSearchFromMainQuery(suggestion);
  };

  const handleGenerateFromDetailedFilters = useCallback(() => {
    if (opcjeZaawansowane.wybraneSkladniki.length === 0 && !opcjeZaawansowane.poraDnia && !opcjeZaawansowane.typKuchni && !zapytanie) {
       setError('Wybierz przynajmniej jeden filtr lub wpisz zapytanie, aby użyć filtrów szczegółowych.');
       return;
    }
    const prompt = generateRecipePrompt(zapytanie, opcjeZaawansowane);
    performGeneration(prompt, "filtry szczegółowe");
  }, [opcjeZaawansowane, zapytanie, performGeneration]);

  const handleIngredientToggle = useCallback((skladnik: Skladnik) => {
    setOpcjeZaawansowane(prev => {
      const isSelected = prev.wybraneSkladniki.find(s => s.id === skladnik.id);
      if (isSelected) {
        return { ...prev, wybraneSkladniki: prev.wybraneSkladniki.filter(s => s.id !== skladnik.id) };
      } else {
        if (prev.wybraneSkladniki.length < MAKSYMALNA_LICZBA_SKLADNIKOW) {
          return { ...prev, wybraneSkladniki: [...prev.wybraneSkladniki, skladnik] };
        }
        return prev;
      }
    });
  }, []);

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, MAKSYMALNA_LICZBA_ZDJEC - opcjeZaawansowane.zdjecia.length);
      setOpcjeZaawansowane(prev => ({
        ...prev,
        zdjecia: [...prev.zdjecia, ...newFiles].slice(0, MAKSYMALNA_LICZBA_ZDJEC)
      }));
    }
  }, [opcjeZaawansowane.zdjecia.length]);

  const handleImageRemove = useCallback((index: number) => {
    setOpcjeZaawansowane(prev => ({
      ...prev,
      zdjecia: prev.zdjecia.filter((_, i) => i !== index)
    }));
  }, []);

  const handleGenerateFromImages = useCallback(async () => {
     if (!geminiServiceInstance) {
      setError("Serwis Gemini nie jest zainicjalizowany.");
      return;
    }
    if (opcjeZaawansowane.zdjecia.length === 0) {
      setError("Dodaj przynajmniej jedno zdjęcie, aby wygenerować przepis.");
      return;
    }
    setIsLoading(true);
    clearPreviousResults();
    setStatusWiadomosc('Analizowanie zdjęć i generowanie przepisu... 📸🍲');
    
    try {
      const base64Images = await Promise.all(
        opcjeZaawansowane.zdjecia.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
          });
        })
      );

      const prompt = generateRecipeFromImagesPrompt(opcjeZaawansowane); 
      const { recipes: fetchedRecipes, groundingMetadata } = await geminiServiceInstance.generateRecipesFromImages(prompt, base64Images, SYSTEM_INSTRUCTION_PL);

      if (fetchedRecipes.length === 0) {
        setStatusWiadomosc('Nie udało się rozpoznać składników lub wygenerować przepisu ze zdjęć. 🤔');
         setError('Nie udało się wygenerować przepisów na podstawie zdjęć.');
      } else {
        setPrzepisy(fetchedRecipes);
        setStatusWiadomosc(`Przepis na podstawie zdjęć gotowy! Smacznego! 🍽️`);
      }
       if (groundingMetadata) setGroundingChunks(groundingMetadata);
    } catch (e: any) {
      console.error("Błąd podczas generowania przepisu ze zdjęć:", e);
      setError(`Wystąpił błąd podczas przetwarzania zdjęć: ${e.message}.`);
      setStatusWiadomosc('Coś poszło nie tak przy analizie zdjęć... 😥');
    } finally {
      setIsLoading(false);
    }
  }, [opcjeZaawansowane, geminiServiceInstance]);

  const handleWizardSubmit = useCallback(async (dane: DaneKreatora) => {
    setIsWizardOpen(false);
    const prompt = generateRecipeFromWizardPrompt(dane, opcjeZaawansowane); 
    performGeneration(prompt, "kreator 6-krokowy");
  }, [opcjeZaawansowane, performGeneration]);
  
  const handleGenerateFromOccasion = useCallback(() => {
    if (!selectedOccasion) {
      setError("Wybierz okazję, aby wygenerować przepis.");
      return;
    }
    const prompt = generateRecipeFromOccasionPrompt(selectedOccasion.nazwa, opcjeZaawansowane); 
    performGeneration(prompt, `okazja: ${selectedOccasion.nazwa}`);
  }, [selectedOccasion, opcjeZaawansowane, performGeneration]);


  const renderActivePathContent = () => {
    switch (currentPath) {
      case 'wizard':
        return (
          <div className="p-6 bg-gray-800 rounded-xl shadow-2xl mt-6 text-center">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Kreator Przepisu (6 Kroków)</h3>
            <p className="text-gray-300 mb-4">Odpowiedz na kilka pytań, a my stworzymy dla Ciebie idealny przepis!</p>
            <button
              onClick={() => setIsWizardOpen(true)}
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              Uruchom Kreatora
            </button>
          </div>
        );
      case 'occasion':
        return (
          <OccasionMode
            occasions={POPULARNE_OKAZJE}
            selectedOccasion={selectedOccasion}
            onSelectOccasion={setSelectedOccasion}
            onGenerate={handleGenerateFromOccasion}
            isLoading={isLoading}
          />
        );
      case 'main_search':
      case 'detailed_filters':
      default:
        // UI dla 'main_search' jest w MainContent.
        // UI dla 'detailed_filters' to panel boczny, a MainContent wyświetli odpowiedni komunikat.
        return null; 
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white relative"> 
      <header className="bg-gray-800 shadow-lg p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo className="h-10 w-auto" />
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
              Foody Pro
            </h1>
          </div>
          <button 
            onClick={() => setIsDetailedFiltersPanelOpen(!isDetailedFiltersPanelOpen)} 
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            aria-label="Otwórz menu filtrów"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>
      
      <div className="container mx-auto mt-2">
         <PathSelector currentPath={currentPath} setCurrentPath={(path) => {
           setCurrentPath(path);
           setIsDetailedFiltersPanelOpen(path === 'detailed_filters'); 
           if (path !== 'occasion') setSelectedOccasion(null);
           if (path !== 'main_search') setZapytanie(''); 
           clearPreviousResults();
         }} />
      </div>

      <div className={`flex flex-1 container mx-auto mt-1 pb-4 ${currentPath === 'detailed_filters' ? 'md:space-x-4' : ''}`}>
        {currentPath === 'detailed_filters' && (
             <DetailedFiltersPanel
                isOpen={isDetailedFiltersPanelOpen}
                togglePanel={() => setIsDetailedFiltersPanelOpen(!isDetailedFiltersPanelOpen)}
                opcje={opcjeZaawansowane}
                onOptionChange={handleAdvancedOptionChange}
                wszystkieSkladniki={POPULARNE_SKLADNIKI}
                onIngredientToggle={handleIngredientToggle}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                onGenerateFromImages={handleGenerateFromImages} 
                isLoading={isLoading}
                maxSkladnikow={MAKSYMALNA_LICZBA_SKLADNIKOW}
                maxZdjec={MAKSYMALNA_LICZBA_ZDJEC}
                poryDniaOpcje={PORY_DNIA_OPCJE}
                typyKuchniOpcje={TYPY_KUCHNI}
                kitchenTypeSuggestions={kitchenTypeSuggestions}
                onKitchenQueryChange={handleKitchenQueryChange}
                onKitchenSuggestionClick={handleKitchenSuggestionClick}
                isKitchenSuggesting={isKitchenSuggesting}
                onGenerate={handleGenerateFromDetailedFilters}
             />
        )}
        <MainContent
          zapytanie={zapytanie}
          setZapytanie={handleZapytanieChange}
          onSearch={() => handleSearchFromMainQuery()} 
          przepisy={przepisy}
          isLoading={isLoading}
          error={error}
          groundingChunks={groundingChunks}
          suggestions={searchSuggestions}
          onSuggestionClick={handleMainSuggestionClick}
          isSuggesting={isSuggesting}
          geminiServiceInstance={geminiServiceInstance}
          currentPath={currentPath}
          activePathContentRenderer={renderActivePathContent} 
        />
      </div>

      <Footer statusMessage={statusWiadomosc} appVersion={APP_VERSION} />

      {isWizardOpen && (
        <RecipeWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSubmit={handleWizardSubmit}
        />
      )}
       {!geminiServiceInstance && process.env.API_KEY === undefined && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
          <div className="bg-red-800 p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Błąd Konfiguracji AI</h2>
            <p>Nie znaleziono klucza API Gemini (API_KEY).</p>
            <p>Aplikacja nie będzie mogła generować przepisów.</p>
            <p className="mt-4 text-sm">Upewnij się, że zmienna środowiskowa API_KEY jest poprawnie ustawiona.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;