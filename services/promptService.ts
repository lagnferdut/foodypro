import { OpcjeZaawansowane, DaneKreatora, Skladnik, Recipe } from '../types';

const JSON_RECIPE_STRUCTURE_PROMPT = `
Odpowiedz w formacie JSON. Jeśli generujesz wiele przepisów, zwróć tablicę obiektów JSON.
Każdy obiekt JSON przepisu powinien mieć następującą strukturę:
{
  "nazwa": "string (nazwa przepisu)",
  "opis": "string (krótki, apetyczny opis, max 2-3 zdania)",
  "skladniki": [{"nazwa": "string", "ilosc": "string (np. '2 sztuki', '100g', '1 łyżeczka')"}],
  "kalorie": "number (przybliżona liczba kalorii na porcję)",
  "makroskladniki": {"bialko": "string (np. '20g')", "tluszcze": "string (np. '15g')", "weglowodany": "string (np. '50g')"},
  "typKuchni": "string (np. 'Polska', 'Włoska', 'Azjatycka')",
  "stopienTrudnosci": "'Łatwy' | 'Średni' | 'Trudny'",
  "czasPrzygotowania": "string (np. '30 minut', '1 godzina 20 minut')",
  "wymaganeUrzadzenia": ["string", "string"],
  "poraDnia": "'Śniadanie' | 'Lunch' | 'Obiad' | 'Kolacja' | 'Deser' | 'Przekąska'",
  "ostrzezeniaAlergenow": ["string (np. 'gluten', 'laktoza', 'orzechy')", "string"],
  "instrukcje": "string (szczegółowe instrukcje przygotowania, krok po kroku, używaj znaczników nowej linii \\n do oddzielania kroków)",
  "skladnikiKalorie": [{"nazwa": "string (nazwa głównego składnika)", "kalorie": "number (kcal dla tego składnika w przepisie)", "porcja": "string (np. '100g', '1 sztuka')"}, {"nazwa": "Inny Składnik", "kalorie": 50, "porcja": "1 łyżka"}],
  "aiGeneratedImageBase64": null 
}
Upewnij się, że wszystkie wartości liczbowe (np. kalorie, kalorie w skladnikiKalorie) są typu number, a nie string.
Pole "aiGeneratedImageBase64" ZAWSZE powinno być ustawione na null w tej odpowiedzi JSON, obrazek będzie generowany osobno.
Wszystkie teksty muszą być w języku polskim.
W polu "skladnikiKalorie" podaj przybliżoną kaloryczność dla 2-4 głównych składników dania. Jeśli nie jest to możliwe lub sensowne dla danego przepisu, możesz zwrócić pustą tablicę [] dla "skladnikiKalorie".
Jeśli nie możesz znaleźć przepisu, zwróć pustą tablicę [].
`;


export const generateRecipePrompt = (zapytanieUzytkownika: string, opcje: Partial<OpcjeZaawansowane>): string => {
  let prompt = `Potrzebuję przepisu. ${JSON_RECIPE_STRUCTURE_PROMPT}\n`;
  prompt += `Główne zapytanie użytkownika: "${zapytanieUzytkownika || 'Dowolny ciekawy przepis'}".\n`;

  if (opcje.poraDnia) {
    prompt += `Pora dnia: ${opcje.poraDnia}.\n`;
  }
  if (opcje.typKuchni) { // typKuchni to teraz ID, więc trzeba by mapować na nazwę jeśli AI ma rozumieć
    prompt += `Typ kuchni: ${opcje.typKuchni}.\n`; // AI should understand common cuisine names/IDs
  }
  if (opcje.minKalorie !== undefined && opcje.maxKalorie !== undefined && (opcje.minKalorie > 0 || opcje.maxKalorie < 5000)) {
    prompt += `Kaloryczność: od ${opcje.minKalorie} kcal do ${opcje.maxKalorie} kcal.\n`;
  }
  if (opcje.wybraneSkladniki && opcje.wybraneSkladniki.length > 0) {
    prompt += `Wykorzystaj następujące składniki: ${opcje.wybraneSkladniki.map(s => s.nazwa).join(', ')}.\n`;
  }
  
  prompt += `\nWygeneruj 1 do 3 pasujących przepisów.`;
  return prompt;
};

export const generateRecipeFromImagesPrompt = (opcje: Partial<OpcjeZaawansowane>): string => {
  let prompt = `Przeanalizuj załączone zdjęcia pod kątem widocznych składników spożywczych. Na ich podstawie zaproponuj przepis. ${JSON_RECIPE_STRUCTURE_PROMPT}\n`;
  
  if (opcje.poraDnia) {
    prompt += `Pora dnia: ${opcje.poraDnia}.\n`;
  }
  if (opcje.typKuchni) {
    prompt += `Typ kuchni: ${opcje.typKuchni}.\n`;
  }
   if (opcje.minKalorie !== undefined && opcje.maxKalorie !== undefined && (opcje.minKalorie > 0 || opcje.maxKalorie < 5000)) {
    prompt += `Kaloryczność: od ${opcje.minKalorie} kcal do ${opcje.maxKalorie} kcal.\n`;
  }
  if (opcje.wybraneSkladniki && opcje.wybraneSkladniki.length > 0) {
     prompt += `Dodatkowo uwzględnij te składniki, jeśli pasują: ${opcje.wybraneSkladniki.map(s => s.nazwa).join(', ')}.\n`;
  }

  prompt += `\nWygeneruj 1 przepis na podstawie zidentyfikowanych składników i powyższych kryteriów. Jeśli na zdjęciach nie widać wyraźnie składników spożywczych, poinformuj o tym.`;
  return prompt;
};

export const generateRecipeFromWizardPrompt = (dane: DaneKreatora, opcje: Partial<OpcjeZaawansowane>): string => {
  let prompt = `Potrzebuję przepisu na podstawie poniższych szczegółowych preferencji (kreator 6-krokowy). ${JSON_RECIPE_STRUCTURE_PROMPT}\n`;
  
  prompt += `Użytkownik lubi: ${dane.coLubisz || 'brak konkretnych preferencji co do smaków/składników'}.\n`;
  prompt += `Poziom głodu (0-6): ${dane.poziomGłodu} (gdzie 0 to wcale, 6 to bardzo głodny).\n`;
  prompt += `Preferowana temperatura dania: ${dane.temperaturaDania}.\n`;
  prompt += `Preferowany profil smaku: ${dane.profilSmaku}.\n`;
  prompt += `Preferowany stopień skomplikowania: ${dane.zlozonosc}.\n`;
  prompt += `Maksymalny czas przygotowania: ${dane.maxCzasPrzygotowania} minut.\n`;

  if (opcje.poraDnia && !prompt.includes('Pora dnia:')) { 
    prompt += `Pora dnia: ${opcje.poraDnia}.\n`;
  }
  if (opcje.typKuchni && !prompt.includes('Typ kuchni:')) {
    prompt += `Typ kuchni: ${opcje.typKuchni}.\n`;
  }
  if (opcje.minKalorie !== undefined && opcje.maxKalorie !== undefined && (opcje.minKalorie > 0 || opcje.maxKalorie < 5000) && !prompt.includes('Kaloryczność:')) {
    prompt += `Kaloryczność: od ${opcje.minKalorie} kcal do ${opcje.maxKalorie} kcal.\n`;
  }
  if (opcje.wybraneSkladniki && opcje.wybraneSkladniki.length > 0) {
    prompt += `Dodatkowo uwzględnij składniki: ${opcje.wybraneSkladniki.map(s => s.nazwa).join(', ')}.\n`;
  }
  
  prompt += `\nWygeneruj 1 przepis spełniający te kryteria.`;
  return prompt;
};

export const generateRecipeFromOccasionPrompt = (okazjaNazwa: string, opcje: Partial<OpcjeZaawansowane>): string => {
  let prompt = `Potrzebuję przepisu specjalnie na okazję: "${okazjaNazwa}". ${JSON_RECIPE_STRUCTURE_PROMPT}\n`;
  prompt += `Dopasuj charakter przepisu do tej okazji. Może to być coś eleganckiego, szybkiego, tradycyjnego, nowoczesnego, itp., w zależności od okazji.\n`;

  // Można dodać opcjonalne dodatkowe filtry z OpcjeZaawansowane, jeśli są ustawione
  if (opcje.poraDnia) {
    prompt += `Dodatkowo, preferowana pora dnia: ${opcje.poraDnia}.\n`;
  }
  if (opcje.typKuchni) {
    prompt += `Dodatkowo, preferowany typ kuchni: ${opcje.typKuchni}.\n`;
  }
  if (opcje.minKalorie !== undefined && opcje.maxKalorie !== undefined && (opcje.minKalorie > 0 || opcje.maxKalorie < 5000)) {
    prompt += `Dodatkowo, kaloryczność: od ${opcje.minKalorie} kcal do ${opcje.maxKalorie} kcal.\n`;
  }
   if (opcje.wybraneSkladniki && opcje.wybraneSkladniki.length > 0) {
    prompt += `Jeśli to możliwe, wykorzystaj też niektóre z tych składników: ${opcje.wybraneSkladniki.map(s => s.nazwa).join(', ')}.\n`;
  }

  prompt += `\nWygeneruj 1-2 przepisy idealnie pasujące do okazji "${okazjaNazwa}" i ewentualnych dodatkowych kryteriów.`;
  return prompt;
};

export const generateSuggestionsPrompt = (partialQuery: string): string => {
  return `Podaj do 5 krótkich sugestii kulinarnych (np. nazwy dań, główne składniki, typy kuchni) pasujących do frazy: "${partialQuery}". Każdą sugestię umieść w nowej linii. Nie dodawaj numeracji ani myślników. Odpowiedź powinna zawierać tylko listę sugestii. Przykład: Jeśli fraza to "kurczak na szybko", możesz zasugerować: "Kurczak curry", "Szybka sałatka z kurczakiem", "Pierś z kurczaka z warzywami".`;
};

export const generateKitchenTypeSuggestionsPrompt = (partialQuery: string): string => {
  return `Podaj do 5 sugestii typów kuchni pasujących do frazy: "${partialQuery}". Każdą sugestię umieść w nowej linii. Odpowiedź powinna zawierać tylko listę nazw typów kuchni. Priorytetyzuj popularne kuchnie. Np. dla "wło" -> "Włoska". Dla "azja" -> "Azjatycka", "Chińska", "Tajska".`;
};
