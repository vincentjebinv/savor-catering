/**
 * TranslationService.ts
 * 
 * Supports both high-speed offline dictionary translation 
 * and optional Cloud Translation API for accuracy.
 */

import { toTamil as offlineToTamil, toEnglish as offlineToEnglish } from '../utils/OfflineTranslator';



// 🌐 Using MyMemory API (Free, no credit card required for basic use)
export const translateText = async (text: string, targetLang: 'ta' | 'en'): Promise<string> => {
  if (!text.trim()) return '';

  // 1. Try Offline first for speed (instant)
  const offlineMatch = targetLang === 'ta' ? offlineToTamil(text) : offlineToEnglish(text);
  
  if (offlineMatch.toLowerCase() !== text.toLowerCase()) {
    return offlineMatch;
  }

  // 2. Clear translation via MyMemory API
  try {
    const fromLang = targetLang === 'ta' ? 'en' : 'ta';
    const toLang = targetLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return offlineMatch;
  } catch (error) {
    console.error("Free Translation Error:", error);
    return offlineMatch;
  }
};
