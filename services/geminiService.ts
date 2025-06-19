import { GoogleGenAI, GenerateContentResponse, Part, HarmCategory, HarmBlockThreshold, GroundingChunk } from "@google/genai";
import { Recipe, TypKuchni } from "../types"; // Dodano TypKuchni
import { GEMINI_MODEL_TEXT, GEMINI_MODEL_IMAGE_GEN, TYPY_KUCHNI } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required to initialize GeminiService.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private parseJsonFromText(text: string): any {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; 
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonStr, e);
      throw new Error(`Nie udało się przetworzyć odpowiedzi JSON od AI: ${e}. Odpowiedź: ${jsonStr.substring(0,1000)}`);
    }
  }

  async generateRecipes(prompt: string, systemInstruction?: string): Promise<{recipes: Recipe[], groundingMetadata?: GroundingChunk[]}> {
    try {
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.5, 
          topP: 0.9,
          topK: 40,
        },
        safetySettings,
      });

      const parsedData = this.parseJsonFromText(response.text);
      const recipes = Array.isArray(parsedData) ? parsedData : (parsedData && typeof parsedData === 'object' ? [parsedData] : []);
      
      const validRecipes = recipes.filter(r => r && r.nazwa && r.skladniki && r.instrukcje);
      if (validRecipes.length === 0 && recipes.length > 0) {
        console.warn("Parsed data from AI does not match expected Recipe structure", recipes);
      }
      
      validRecipes.forEach(recipe => {
        if (recipe.skladnikiKalorie && !Array.isArray(recipe.skladnikiKalorie)) {
          console.warn("AI returned non-array for skladnikiKalorie, correcting.", recipe.skladnikiKalorie);
          recipe.skladnikiKalorie = [];
        }
         // Ensure aiGeneratedImageBase64 is initialized if not present
        if (recipe.aiGeneratedImageBase64 === undefined) {
            recipe.aiGeneratedImageBase64 = null; // Or undefined, consistent with RecipeCard
        }
      });

      return {
        recipes: validRecipes as Recipe[],
        groundingMetadata: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };

    } catch (error: any) {
      console.error('Błąd Gemini API (generateRecipes):', error);
      if (error.message && error.message.includes("SAFETY")) {
         throw new Error("Odpowiedź zablokowana ze względów bezpieczeństwa. Spróbuj przeformułować zapytanie.");
      }
      throw new Error(`Błąd komunikacji z AI: ${error.message || 'Nieznany błąd'}`);
    }
  }
  
  async generateRecipesFromImages(prompt: string, base64Images: string[], systemInstruction?: string): Promise<{recipes: Recipe[], groundingMetadata?: GroundingChunk[]}> {
    try {
      const imageParts: Part[] = base64Images.map(base64Data => ({
        inlineData: {
          mimeType: 'image/jpeg', 
          data: base64Data,
        },
      }));

      const textPart: Part = { text: prompt };
      
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT, 
        contents: { parts: [...imageParts, textPart] },
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.5,
        },
        safetySettings,
      });

      const parsedData = this.parseJsonFromText(response.text);
      const recipes = Array.isArray(parsedData) ? parsedData : (parsedData && typeof parsedData === 'object' ? [parsedData] : []);
      
      const validRecipes = recipes.filter(r => r && r.nazwa && r.skladniki && r.instrukcje);
      if (validRecipes.length === 0 && recipes.length > 0) {
        console.warn("Parsed data from AI (images) does not match expected Recipe structure", recipes);
      }
      
      validRecipes.forEach(recipe => {
        if (recipe.skladnikiKalorie && !Array.isArray(recipe.skladnikiKalorie)) {
            console.warn("AI returned non-array for skladnikiKalorie (images), correcting.", recipe.skladnikiKalorie);
            recipe.skladnikiKalorie = [];
        }
        if (recipe.aiGeneratedImageBase64 === undefined) {
            recipe.aiGeneratedImageBase64 = null;
        }
      });

      return {
        recipes: validRecipes as Recipe[],
        groundingMetadata: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };

    } catch (error: any) {
      console.error('Błąd Gemini API (generateRecipesFromImages):', error);
      if (error.message && error.message.includes("SAFETY")) {
         throw new Error("Odpowiedź zablokowana ze względów bezpieczeństwa. Spróbuj przeformułować zapytanie lub użyć innych zdjęć.");
      }
      throw new Error(`Błąd komunikacji z AI podczas analizy obrazów: ${error.message || 'Nieznany błąd'}`);
    }
  }

  async generateSuggestions(prompt: string): Promise<string[]> {
    try {
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ];

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          temperature: 0.3, // Lower temp for more predictable suggestions
          topP: 0.8,
          topK: 10,
          maxOutputTokens: 50, // Limit output for suggestions
          thinkingConfig: { thinkingBudget: 0 } 
        },
        safetySettings,
      });
      
      const textResponse = response.text;
      if (!textResponse) return [];

      return textResponse.split('\n').map(s => s.trim()).filter(s => s.length > 2 && s.length < 50); // Filter suggestions by length

    } catch (error: any) {
      console.error('Błąd Gemini API (generateSuggestions):', error);
      return [];
    }
  }
  
  // Method for kitchen type suggestions - currently client-side filtering is used in App.tsx for speed.
  // This is a placeholder if AI-powered suggestions are desired in the future.
  async generateKitchenTypeSuggestions(prompt: string): Promise<string[]> {
     try {
      const safetySettings = [ /* ... same as generateSuggestions ... */ ];
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: { temperature: 0.2, topK: 5, maxOutputTokens: 30, thinkingConfig: { thinkingBudget: 0 } },
        safetySettings,
      });
      const textResponse = response.text;
      if (!textResponse) return [];
      return textResponse.split('\n').map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
    } catch (error: any) {
      console.error('Błąd Gemini API (generateKitchenTypeSuggestions):', error);
      return TYPY_KUCHNI.map(k => k.nazwa); // Fallback to all kitchen types
    }
  }


  async generateImageForRecipe(recipeName: string, recipeDescription?: string): Promise<string> {
    try {
      const prompt = `Profesjonalna fotografia kulinarna potrawy: ${recipeName}. ${recipeDescription || ''} 
      Zdjęcie w stylu "food photography", bardzo apetyczne, realistyczne, dobrze oświetlone, ostre detale, 
      estetyczna kompozycja na talerzu lub w misce, odpowiednio do dania. Naturalne kolory. Unikaj kreskówkowego stylu.`;
      
      const safetySettings = [ 
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }, // Slightly more permissive
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      const response = await this.ai.models.generateImages({
        model: GEMINI_MODEL_IMAGE_GEN,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        // safetySettings: safetySettings, // Assuming API supports safety settings for images
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].error) {
        // Handle specific error from image generation if provided
        console.error("Błąd generowania obrazu (szczegóły od AI):", response.generatedImages[0].error.message);
        throw new Error(`AI zwróciło błąd przy generowaniu obrazu: ${response.generatedImages[0].error.message}`);
      }
      else {
        throw new Error("AI nie zwróciło obrazu lub obraz jest niekompletny.");
      }
    } catch (error: any) {
      console.error('Błąd Gemini API (generateImageForRecipe):', error);
      if (error.message && error.message.includes("SAFETY")) {
         throw new Error("Generowanie obrazu zablokowane ze względów bezpieczeństwa.");
      }
       if (error.message && error.message.includes("quota")) {
         throw new Error("Przekroczono limit zapytań o obrazy. Spróbuj później.");
      }
      throw new Error(`Błąd generowania obrazu przez AI: ${error.message || 'Nieznany błąd'}`);
    }
  }
}
