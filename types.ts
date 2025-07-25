
export interface Recipe {
  nazwa: string;
  opis: string;
  skladniki: Array<{ nazwa: string; ilosc: string }>;
  kalorie: number;
  makroskladniki: { bialko: string; tluszcze: string; weglowodany: string };
  typKuchni: string;
  stopienTrudnosci: 'Łatwy' | 'Średni' | 'Trudny';
  czasPrzygotowania: string;
  wymaganeUrzadzenia: string[];
  poraDnia: PoraDnia;
  ostrzezeniaAlergenow: string[];
  instrukcje: string;
  skladnikiKalorie?: Array<{ nazwa: string; kalorie: number; porcja: string }>;
  aiGeneratedImageBase64?: string | null; // Allow null for explicit empty state
}

export enum PoraDnia {
  SNIADANIE = 'Śniadanie',
  LUNCH = 'Lunch',
  OBIAD = 'Obiad',
  KOLACJA = 'Kolacja',
  DESER = 'Deser',
  PRZEKASKA = 'Przekąska',
}

export interface Skladnik {
  id: string;
  nazwa: string;
  piktogram: string; 
}

export interface TypKuchni {
  id: string;
  nazwa: string;
  flaga?: string; // Opcjonalna flaga emoji
}

export interface Okazja {
  id: string;
  nazwa: string;
}

export interface OpcjeZaawansowane {
  poraDnia?: PoraDnia;
  typKuchni?: string; 
  typKuchniQuery: string; 
  minKalorie: number;
  maxKalorie: number;
  wybraneSkladniki: Skladnik[];
  zdjecia: File[]; // To pole będzie teraz głównie używane przez nowy tryb "Przepis ze zdjęć"
}

export interface KrokKreatora {
  pytanie: string;
  odpowiedz: string;
  typPola: 'text' | 'number' | 'radio' | 'select';
  opcje?: string[];
}

export interface DaneKreatora {
  coLubisz: string;
  poziomGłodu: number; 
  temperaturaDania: 'Ciepłe' | 'Zimne' | 'Bez znaczenia';
  profilSmaku: 'Słodkie' | 'Słone' | 'Kwaśne' | 'Pikantne' | 'Gorzkie' | 'Umami' | 'Dowolny';
  zlozonosc: 'Proste' | 'Średniozaawansowane' | 'Skomplikowane' | 'Dowolna';
  maxCzasPrzygotowania: number; 
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export type RecipeGenerationPath = 'main_search' | 'detailed_filters' | 'wizard' | 'occasion' | 'photo_upload';