import { PoraDnia, Skladnik, TypKuchni, Okazja } from './types';

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE_GEN = 'imagen-3.0-generate-002'; 

export const PORY_DNIA_OPCJE: Array<{ value: PoraDnia; label: string }> = [
  { value: PoraDnia.SNIADANIE, label: 'Śniadanie' },
  { value: PoraDnia.LUNCH, label: 'Drugie Śniadanie / Lunch' },
  { value: PoraDnia.OBIAD, label: 'Obiad' },
  { value: PoraDnia.KOLACJA, label: 'Kolacja' },
  { value: PoraDnia.DESER, label: 'Deser' },
  { value: PoraDnia.PRZEKASKA, label: 'Przekąska' },
];

export const TYPY_KUCHNI: TypKuchni[] = [
  { id: 'polska', nazwa: 'Polska' },
  { id: 'wloska', nazwa: 'Włoska' },
  { id: 'francuska', nazwa: 'Francuska' },
  { id: 'hiszpanska', nazwa: 'Hiszpańska' },
  { id: 'meksykanska', nazwa: 'Meksykańska' },
  { id: 'chinska', nazwa: 'Chińska' },
  { id: 'japonska', nazwa: 'Japońska' },
  { id: 'tajska', nazwa: 'Tajska' },
  { id: 'indyjska', nazwa: 'Indyjska' },
  { id: 'grecka', nazwa: 'Grecka' },
  { id: 'amerykanska', nazwa: 'Amerykańska' },
  { id: 'srodziemnomorska', nazwa: 'Śródziemnomorska' },
  { id: 'wegetarianska', nazwa: 'Wegetariańska' },
  { id: 'weganska', nazwa: 'Wegańska' },
  { id: 'bliskowschodnia', nazwa: 'Bliskowschodnia' },
  { id: 'koreanska', nazwa: 'Koreańska' },
  { id: 'fusion', nazwa: 'Fusion' },
  { id: 'bezglutenowa', nazwa: 'Bezglutenowa' },
];

export const POPULARNE_SKLADNIKI: Skladnik[] = [
  // Warzywa
  { id: 'ziemniaki', nazwa: 'Ziemniaki', piktogram: '🥔' },
  { id: 'marchew', nazwa: 'Marchew', piktogram: '🥕' },
  { id: 'cebula', nazwa: 'Cebula', piktogram: '🧅' },
  { id: 'czosnek', nazwa: 'Czosnek', piktogram: '🧄' },
  { id: 'pomidor', nazwa: 'Pomidor', piktogram: '🍅' },
  { id: 'ogorek', nazwa: 'Ogórek', piktogram: '🥒' },
  { id: 'papryka_czerwona', nazwa: 'Papryka czerwona', piktogram: '🌶️' },
  { id: 'brokuly', nazwa: 'Brokuły', piktogram: '🥦' },
  { id: 'kalafior', nazwa: 'Kalafior', piktogram: '🥦' },
  { id: 'szpinak', nazwa: 'Szpinak', piktogram: '🥬' },
  { id: 'salata', nazwa: 'Sałata', piktogram: '🥬' },
  { id: 'kapusta_biala', nazwa: 'Kapusta biała', piktogram: '🥬' },
  { id: 'kapusta_kiszona', nazwa: 'Kapusta kiszona', piktogram: '🫙' },
  { id: 'buraki', nazwa: 'Buraki', piktogram: '🍠' }, 
  { id: 'cukinia', nazwa: 'Cukinia', piktogram: '🥒' },
  { id: 'baklazan', nazwa: 'Bakłażan', piktogram: '🍆' },
  { id: 'fasolka_szparagowa', nazwa: 'Fasolka szparagowa', piktogram: '🫛' },
  { id: 'groszek_zielony', nazwa: 'Groszek zielony', piktogram: '🫛' },
  { id: 'kukurydza', nazwa: 'Kukurydza', piktogram: '🌽' },
  { id: 'por', nazwa: 'Por', piktogram: '🌿' },
  { id: 'seler_naciowy', nazwa: 'Seler naciowy', piktogram: '🌿' },
  { id: 'seler_korzeniowy', nazwa: 'Seler korzeniowy', piktogram: '🌿' }, 
  { id: 'pietruszka_korzen', nazwa: 'Pietruszka (korzeń)', piktogram: '🌿' }, 
  { id: 'pietruszka_natka', nazwa: 'Pietruszka (natka)', piktogram: '🌿' },
  { id: 'koperek', nazwa: 'Koperek', piktogram: '🌿' },
  { id: 'dynia', nazwa: 'Dynia', piktogram: '🎃' },
  { id: 'grzyby_lesne', nazwa: 'Grzyby leśne', piktogram: '🍄' },
  { id: 'pieczarki', nazwa: 'Pieczarki', piktogram: '🍄' },
  // Owoce
  { id: 'jablka', nazwa: 'Jabłka', piktogram: '🍎' },
  { id: 'gruszki', nazwa: 'Gruszki', piktogram: '🍐' },
  { id: 'sliwki', nazwa: 'Śliwki', piktogram: '🍑' }, 
  { id: 'truskawki', nazwa: 'Truskawki', piktogram: '🍓' },
  { id: 'maliny', nazwa: 'Maliny', piktogram: '🍓' }, 
  { id: 'borowki', nazwa: 'Borówki', piktogram: '🫐' },
  { id: 'winogrona', nazwa: 'Winogrona', piktogram: '🍇' },
  { id: 'banany', nazwa: 'Banany', piktogram: '🍌' },
  { id: 'pomarancze', nazwa: 'Pomarańcze', piktogram: '🍊' },
  { id: 'cytryny', nazwa: 'Cytryny', piktogram: '🍋' },
  { id: 'awokado', nazwa: 'Awokado', piktogram: '🥑' },
  // Produkty zbożowe
  { id: 'chleb_pszenny', nazwa: 'Chleb pszenny', piktogram: '🍞' },
  { id: 'chleb_zytni', nazwa: 'Chleb żytni', piktogram: '🍞' },
  { id: 'bulki', nazwa: 'Bułki', piktogram: '🥖' },
  { id: 'makaron', nazwa: 'Makaron', piktogram: '🍝' },
  { id: 'ryz_bialy', nazwa: 'Ryż biały', piktogram: '🍚' },
  { id: 'ryz_brazowy', nazwa: 'Ryż brązowy', piktogram: '🍚' },
  { id: 'kasza_gryczana', nazwa: 'Kasza gryczana', piktogram: '🍚' }, 
  { id: 'kasza_jaglana', nazwa: 'Kasza jaglana', piktogram: '🍚' }, 
  { id: 'kasza_peczak', nazwa: 'Kasza pęczak', piktogram: '🍚' }, 
  { id: 'platki_owsiane', nazwa: 'Płatki owsiane', piktogram: '🥣' },
  { id: 'maka_pszenna', nazwa: 'Mąka pszenna', piktogram: '🌾' },
  { id: 'maka_zytnia', nazwa: 'Mąka żytnia', piktogram: '🌾' },
  // Nabiał i jaja
  { id: 'mleko', nazwa: 'Mleko', piktogram: '🥛' },
  { id: 'jogurt_naturalny', nazwa: 'Jogurt naturalny', piktogram: '🥣' },
  { id: 'kefir', nazwa: 'Kefir', piktogram: '🥛' },
  { id: 'smietana_18', nazwa: 'Śmietana 18%', piktogram: '🥛' }, 
  { id: 'smietana_30', nazwa: 'Śmietana 30%', piktogram: '🥛' }, 
  { id: 'twarog', nazwa: 'Twaróg', piktogram: '🧀' },
  { id: 'ser_zolty', nazwa: 'Ser żółty', piktogram: '🧀' },
  { id: 'ser_plesniowy', nazwa: 'Ser pleśniowy', piktogram: '🧀' },
  { id: 'jaja', nazwa: 'Jaja', piktogram: '🥚' },
  { id: 'maslo', nazwa: 'Masło', piktogram: '🧈' },
  // Mięso i ryby
  { id: 'kurczak_piers', nazwa: 'Kurczak (pierś)', piktogram: '🍗' },
  { id: 'kurczak_udka', nazwa: 'Kurczak (udka)', piktogram: '🍗' },
  { id: 'indyk_piers', nazwa: 'Indyk (pierś)', piktogram: '🦃' },
  { id: 'wolowina', nazwa: 'Wołowina', piktogram: '🥩' },
  { id: 'wieprzowina_schab', nazwa: 'Wieprzowina (schab)', piktogram: '🥓' }, 
  { id: 'wieprzowina_lopatka', nazwa: 'Wieprzowina (łopatka)', piktogram: '🍖' },
  { id: 'kielbasa', nazwa: 'Kiełbasa', piktogram: '🌭' },
  { id: 'boczek', nazwa: 'Boczek', piktogram: '🥓' },
  { id: 'losos', nazwa: 'Łosoś', piktogram: '🐟' },
  { id: 'dorsz', nazwa: 'Dorsz', piktogram: '🐟' },
  { id: 'sledz', nazwa: 'Śledź', piktogram: '🐟' },
  { id: 'makrela', nazwa: 'Makrela', piktogram: '🐟' },
  { id: 'tunczyk_konserwa', nazwa: 'Tuńczyk (konserwa)', piktogram: '🥫' },
  // Nasiona, orzechy, strączkowe
  { id: 'fasola_czerwona', nazwa: 'Fasola czerwona (konserwa)', piktogram: '🥫' },
  { id: 'fasola_biala', nazwa: 'Fasola biała (konserwa)', piktogram: '🥫' },
  { id: 'ciecierzyca', nazwa: 'Ciecierzyca (konserwa)', piktogram: '🫘' },
  { id: 'soczewica_czerwona', nazwa: 'Soczewica czerwona', piktogram: '🫘' },
  { id: 'soczewica_zielona', nazwa: 'Soczewica zielona', piktogram: '🫘' },
  { id: 'orzechy_wloskie', nazwa: 'Orzechy włoskie', piktogram: '🌰' },
  { id: 'migdaly', nazwa: 'Migdały', piktogram: '🌰' }, 
  { id: 'nasiona_slonecznika', nazwa: 'Nasiona słonecznika', piktogram: '🌻' },
  { id: 'pestki_dyni', nazwa: 'Pestki dyni', piktogram: '🎃' }, 
  { id: 'siemie_lniane', nazwa: 'Siemię lniane', piktogram: '🌱' },
  { id: 'sezam', nazwa: 'Sezam', piktogram: '🌱' },
  // Tłuszcze i oleje
  { id: 'oliwa_z_oliwek', nazwa: 'Oliwa z oliwek', piktogram: '🫒' },
  { id: 'olej_rzepakowy', nazwa: 'Olej rzepakowy', piktogram: '🫒' }, 
  { id: 'olej_slonecznikowy', nazwa: 'Olej słonecznikowy', piktogram: '🌻' },
  // Przyprawy i dodatki
  { id: 'sol', nazwa: 'Sól', piktogram: '🧂' },
  { id: 'pieprz_czarny', nazwa: 'Pieprz czarny', piktogram: '⚫' }, 
  { id: 'cukier', nazwa: 'Cukier', piktogram: '🍬' }, 
  { id: 'miod', nazwa: 'Miód', piktogram: '🍯' },
  { id: 'musztarda', nazwa: 'Musztarda', piktogram: '🌭' }, 
  { id: 'ketchup', nazwa: 'Ketchup', piktogram: '🥫' },
  { id: 'majonez', nazwa: 'Majonez', piktogram: '🥚' }, 
  { id: 'ocet_spirytusowy', nazwa: 'Ocet spirytusowy', piktogram: '🍾' },
  { id: 'ocet_jablkowy', nazwa: 'Ocet jabłkowy', piktogram: '🍎' }, 
  { id: 'sos_sojowy', nazwa: 'Sos sojowy', piktogram: '🍾' },
  { id: 'koncentrat_pomidorowy', nazwa: 'Koncentrat pomidorowy', piktogram: '🥫' },
  { id: 'papryka_slodka_mielona', nazwa: 'Papryka słodka mielona', piktogram: '🌶️' },
  { id: 'papryka_ostra_mielona', nazwa: 'Papryka ostra mielona', piktogram: '🌶️🔥' },
  { id: 'ziola_prowansalskie', nazwa: 'Zioła prowansalskie', piktogram: '🌿' },
  { id: 'oregano', nazwa: 'Oregano', piktogram: '🌿' },
  { id: 'bazylia', nazwa: 'Bazylia', piktogram: '🌿' },
  { id: 'tymianek', nazwa: 'Tymianek', piktogram: '🌿' },
  { id: 'rozmaryn', nazwa: 'Rozmaryn', piktogram: '🌿' },
  { id: 'lisc_laurowy', nazwa: 'Liść laurowy', piktogram: '🌿' },
  { id: 'ziele_angielskie', nazwa: 'Ziele angielskie', piktogram: '🌿' },
  { id: 'curry', nazwa: 'Curry', piktogram: '🍛' },
  { id: 'kurkuma', nazwa: 'Kurkuma', piktogram: '🌿' },
  { id: 'imbir_swiezy', nazwa: 'Imbir świeży', piktogram: '🫚' },
  { id: 'cynamon', nazwa: 'Cynamon', piktogram: '🌿' },
  { id: 'wanilia', nazwa: 'Wanilia', piktogram: '🌿' },
  { id: 'czekolada_gorzka', nazwa: 'Czekolada gorzka', piktogram: '🍫' },
  { id: 'kakao', nazwa: 'Kakao', piktogram: '🍫' },
];


export const MAKSYMALNA_LICZBA_SKLADNIKOW = 12;
export const MAKSYMALNA_LICZBA_ZDJEC = 3;

export const PROFIL_SMAKU_OPCJE: string[] = ['Słodkie', 'Słone', 'Kwaśne', 'Pikantne', 'Gorzkie', 'Umami', 'Dowolny'];
export const ZLOZONOSC_OPCJE: string[] = ['Proste', 'Średniozaawansowane', 'Skomplikowane', 'Dowolna'];
export const TEMPERATURA_DANIA_OPCJE: string[] = ['Ciepłe', 'Zimne', 'Bez znaczenia'];

export const POPULARNE_OKAZJE: Okazja[] = [
  { id: 'romantyczna_kolacja', nazwa: 'Romantyczna kolacja' },
  { id: 'szybki_lunch', nazwa: 'Szybki lunch do pracy' },
  { id: 'przyjecie_urodzinowe', nazwa: 'Przyjęcie urodzinowe' },
  { id: 'grill_z_przyjaciolmi', nazwa: 'Grill z przyjaciółmi' },
  { id: 'swiateczny_obiad', nazwa: 'Świąteczny obiad/kolacja' },
  { id: 'zdrowa_przekaska', nazwa: 'Zdrowa przekąska po treningu' },
  { id: 'comfort_food', nazwa: 'Comfort food na wieczór' },
  { id: 'elegancka_przystawka', nazwa: 'Elegancka przystawka' },
  { id: 'dzieciece_przyjecie', nazwa: 'Dziecięce przyjęcie' },
  { id: 'weekendowe_sniadanie', nazwa: 'Weekendowe śniadanie' },
  { id: 'lekka_kolacja', nazwa: 'Lekka kolacja' },
  { id: 'danie_jednogarnkowe', nazwa: 'Sycące danie jednogarnkowe' },
];


export const SYSTEM_INSTRUCTION_PL = `Jesteś światowej klasy szefem kuchni i dietetykiem. Twoim zadaniem jest tworzenie szczegółowych i apetycznych przepisów na podstawie preferencji użytkownika. Zawsze odpowiadaj po polsku. Zwróć uwagę na poprawność językową i kulturową. Prezentuj przepisy w sposób klarowny i zachęcający. 
Jeśli użytkownik prosi o przepis na podstawie składników, skup się na ich wykorzystaniu. 
Jeśli użytkownik podaje zdjęcia, zidentyfikuj kluczowe składniki i na ich podstawie stwórz propozycję. 
Jeśli użytkownik korzysta z kreatora 6-etapowego, precyzyjnie dopasuj przepis do wszystkich podanych kryteriów.
Jeśli użytkownik wybiera przepis na okazję, stwórz coś odpowiedniego charakterem do tej okazji.
Upewnij się, że JSON jest poprawny i kompletny. Pola liczbowe jak 'kalorie' powinny być liczbami, a nie stringami. W 'ostrzezeniaAlergenow' wymień potencjalne alergeny obecne w przepisie lub składnikach. W 'wymaganeUrzadzenia' wymień sprzęty kuchenne potrzebne do przygotowania dania. Czas przygotowania podaj w formacie "X minut" lub "Y godzin Z minut". Stopień trudności to jeden z: 'Łatwy', 'Średni', 'Trudny'. Pora dnia to jedna z: 'Śniadanie', 'Lunch', 'Obiad', 'Kolacja', 'Deser', 'Przekąska'. Makroskładniki podawaj w gramach, np. "białko: 20g".`;

export const APP_VERSION = "2.1"; 

// Pozostałe piktogramy wydają się być już w miarę dobrze zmapowane w poprzednich krokach.
// Ta sekcja piktogramUpdates została usunięta, ponieważ większość mapowań została zintegrowana bezpośrednio 
// w definicji POPULARNE_SKLADNIKI lub w poprzednich iteracjach czyszczenia.
// Zachowano tylko ostateczne poprawki.

POPULARNE_SKLADNIKI.find(s => s.id === 'papryka_czerwona')!.piktogram = '🌶️';
POPULARNE_SKLADNIKI.find(s => s.id === 'papryka_slodka_mielona')!.piktogram = '🌶️';
POPULARNE_SKLADNIKI.find(s => s.id === 'papryka_ostra_mielona')!.piktogram = '🌶️🔥';
POPULARNE_SKLADNIKI.find(s => s.id === 'curry')!.piktogram = '🍛';
POPULARNE_SKLADNIKI.find(s => s.id === 'imbir_swiezy')!.piktogram = '🫚';
POPULARNE_SKLADNIKI.find(s => s.id === 'kapusta_kiszona')!.piktogram = '🫙';
POPULARNE_SKLADNIKI.find(s => s.id === 'fasolka_szparagowa')!.piktogram = '🫛';
POPULARNE_SKLADNIKI.find(s => s.id === 'groszek_zielony')!.piktogram = '🫛';
POPULARNE_SKLADNIKI.find(s => s.id === 'ciecierzyca')!.piktogram = '🫘'; // Prawidłowy dla ciecierzycy
POPULARNE_SKLADNIKI.find(s => s.id === 'fasola_czerwona')!.piktogram = '🫘'; // Użycie ogólnego emoji dla fasoli
POPULARNE_SKLADNIKI.find(s => s.id === 'fasola_biala')!.piktogram = '🫘'; // Użycie ogólnego emoji dla fasoli
POPULARNE_SKLADNIKI.find(s => s.id === 'soczewica_czerwona')!.piktogram = '🫘';
POPULARNE_SKLADNIKI.find(s => s.id === 'soczewica_zielona')!.piktogram = '🫘';
POPULARNE_SKLADNIKI.find(s => s.id === 'oliwa_z_oliwek')!.piktogram = '🫒';
POPULARNE_SKLADNIKI.find(s => s.id === 'olej_rzepakowy')!.piktogram = '🍾'; // butelka oleju
POPULARNE_SKLADNIKI.find(s => s.id === 'migdaly')!.piktogram = '🌰'; // orzech jako migdał
POPULARNE_SKLADNIKI.find(s => s.id === 'sliwki')!.piktogram = '🍑'; // brzoskwinia jako śliwka
POPULARNE_SKLADNIKI.find(s => s.id === 'maliny')!.piktogram = '🍓'; // truskawka jako malina
POPULARNE_SKLADNIKI.find(s => s.id === 'seler_korzeniowy')!.piktogram = '🌿';
POPULARNE_SKLADNIKI.find(s => s.id === 'pietruszka_korzen')!.piktogram = '🌿';
POPULARNE_SKLADNIKI.find(s => s.id === 'buraki')!.piktogram = '🍠'; // batat jako burak
POPULARNE_SKLADNIKI.find(s => s.id === 'kalafior')!.piktogram = '🥦';
POPULARNE_SKLADNIKI.find(s => s.id === 'smietana_18')!.piktogram = '🥛';
POPULARNE_SKLADNIKI.find(s => s.id === 'smietana_30')!.piktogram = '🥛';
POPULARNE_SKLADNIKI.find(s => s.id === 'kakao')!.piktogram = '🍫';
POPULARNE_SKLADNIKI.find(s => s.id === 'pieprz_czarny')!.piktogram = '⚫';
POPULARNE_SKLADNIKI.find(s => s.id === 'musztarda')!.piktogram = '🌭';
POPULARNE_SKLADNIKI.find(s => s.id === 'ocet_jablkowy')!.piktogram = '🍎';
POPULARNE_SKLADNIKI.find(s => s.id === 'cynamon')!.piktogram = '🌿';
POPULARNE_SKLADNIKI.find(s => s.id === 'kasza_gryczana')!.piktogram = '🍚';
POPULARNE_SKLADNIKI.find(s => s.id === 'kasza_jaglana')!.piktogram = '🍚';
POPULARNE_SKLADNIKI.find(s => s.id === 'kasza_peczak')!.piktogram = '🍚';
POPULARNE_SKLADNIKI.find(s => s.id === 'maka_pszenna')!.piktogram = '🌾';
POPULARNE_SKLADNIKI.find(s => s.id === 'maka_zytnia')!.piktogram = '🌾';
POPULARNE_SKLADNIKI.find(s => s.id === 'jogurt_naturalny')!.piktogram = '🥣';
POPULARNE_SKLADNIKI.find(s => s.id === 'wieprzowina_schab')!.piktogram = '🥩'; // Ogólne mięso
POPULARNE_SKLADNIKI.find(s => s.id === 'cukier')!.piktogram = '🍚'; // cukier jako kryształki
POPULARNE_SKLADNIKI.find(s => s.id === 'majonez')!.piktogram = '🥚'; // jajko jako baza majonezu
POPULARNE_SKLADNIKI.find(s => s.id === 'tunczyk_konserwa')!.piktogram = '🥫';
POPULARNE_SKLADNIKI.find(s => s.id === 'koncentrat_pomidorowy')!.piktogram = '🥫';
POPULARNE_SKLADNIKI.find(s => s.id === 'ketchup')!.piktogram = '🍅'; // pomidor jako ketchup

// Fallback for any remaining text pictograms
POPULARNE_SKLADNIKI.forEach(skladnik => {
    if (skladnik.piktogram.length > 2 && !skladnik.piktogram.startsWith('🌶️')) { // Check if it's not a multi-char emoji like the pepper+fire
        skladnik.piktogram = '🍲'; // Default food bowl emoji
    }
     // Restore specific multi-char ones if they got overwritten by the general sweep
    if (skladnik.id === 'papryka_ostra_mielona') skladnik.piktogram = '🌶️🔥';
});
// Ensure specific single emojis that might have been overwritten by length check are correct
const singleEmojiMap: { [key: string]: string } = {
    'ziemniaki': '🥔', 'marchew': '🥕', 'cebula': '🧅', 'czosnek': '🧄', 'pomidor': '🍅', 
    'ogorek': '🥒', 'papryka_czerwona': '🌶️', 'brokuly': '🥦', 'szpinak': '🥬', 
    'salata': '🥬', 'kapusta_biala': '🥬', 'kapusta_kiszona': '🫙', 'cukinia': '🥒', 
    'baklazan': '🍆', 'fasolka_szparagowa': '🫛', 'groszek_zielony': '🫛', 'kukurydza': '🌽', 
    'dynia': '🎃', 'grzyby_lesne': '🍄', 'pieczarki': '🍄', 'jablka': '🍎', 'gruszki': '🍐', 
    'truskawki': '🍓', 'borowki': '🫐', 'winogrona': '🍇', 'banany': '🍌', 'pomarancze': '🍊', 
    'cytryny': '🍋', 'awokado': '🥑', 'chleb_pszenny': '🍞', 'chleb_zytni': '🍞', 'bulki': '🥖', 
    'makaron': '🍝', 'ryz_bialy': '🍚', 'ryz_brazowy': '🍚', 'platki_owsiane': '🥣', 
    'maka_pszenna': '🌾', 'maka_zytnia': '🌾', 'mleko': '🥛', 'kefir': '🥛', 'twarog': '🧀', 
    'ser_zolty': '🧀', 'ser_plesniowy': '🧀', 'jaja': '🥚', 'maslo': '🧈', 'kurczak_piers': '🍗', 
    'kurczak_udka': '🍗', 'indyk_piers': '🦃', 'wolowina': '🥩', 'wieprzowina_lopatka': '🍖', 
    'kielbasa': '🌭', 'boczek': '🥓', 'losos': '🐟', 'dorsz': '🐟', 'sledz': '🐟', 'makrela': '🐟', 
    'tunczyk_konserwa': '🥫', 'fasola_czerwona': '🫘', 'fasola_biala': '🫘', 'ciecierzyca': '🫘', 
    'soczewica_czerwona': '🫘', 'soczewica_zielona': '🫘', 'orzechy_wloskie': '🌰', 
    'nasiona_slonecznika': '🌻', 'pestki_dyni': '🎃', 'siemie_lniane': '🌱', 'sezam': '🌱', 
    'oliwa_z_oliwek': '🫒', 'olej_slonecznikowy': '🌻', 'sol': '🧂', 'miod': '🍯', 
    'ocet_spirytusowy': '🍾', 'sos_sojowy': '🍾', 'koncentrat_pomidorowy': '🥫', 
    'papryka_slodka_mielona': '🌶️', 'curry': '🍛', 'imbir_swiezy': '🫚', 'czekolada_gorzka': '🍫',
    'ketchup': '🍅',
    // Ones that were using fallback or generic:
    'buraki': '🍠', 'kalafior': '🥦', 'por': '🌿', 'seler_naciowy': '🌿', 'seler_korzeniowy': '🌿',
    'pietruszka_korzen': '🌿', 'pietruszka_natka': '🌿', 'koperek': '🌿', 'sliwki': '🍑',
    'maliny': '🍓', 'kasza_gryczana': '🍚', 'kasza_jaglana': '🍚', 'kasza_peczak': '🍚',
    'jogurt_naturalny': '🥣', 'smietana_18': '🥛', 'smietana_30': '🥛', 'wieprzowina_schab': '🥩',
    'migdaly': '🌰', 'olej_rzepakowy': '🍾', 'pieprz_czarny': '⚫', 'cukier': '🍚',
    'musztarda': '🌭', 'majonez': '🥚', 'ocet_jablkowy': '🍎', 'ziola_prowansalskie': '🌿',
    'oregano': '🌿', 'bazylia': '🌿', 'tymianek': '🌿', 'rozmaryn': '🌿', 'lisc_laurowy': '🌿',
    'ziele_angielskie': '🌿', 'kurkuma': '🌿', 'cynamon': '🌿', 'wanilia': '🌿', 'kakao': '🍫'
};
POPULARNE_SKLADNIKI.forEach(skladnik => {
    if (singleEmojiMap[skladnik.id]) {
        skladnik.piktogram = singleEmojiMap[skladnik.id];
    }
});
POPULARNE_SKLADNIKI.find(s => s.id === 'papryka_ostra_mielona')!.piktogram = '🌶️🔥';
