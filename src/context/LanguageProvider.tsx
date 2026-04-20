import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // 🟢 FIX: Imported as a type separately
import { Preferences } from '@capacitor/preferences';
import { dictionary } from '../lib/dictionary';

// Define the shape of the context
interface LanguageContextType {
  language: 'en' | 'ta';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// The Provider Component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  // Load saved language on app start
  useEffect(() => {
    const getLanguage = async () => {
      const { value } = await Preferences.get({ key: 'language' });
      if (value === 'ta') {
        setLanguage('ta');
      }
    };
    getLanguage();
  }, []);

  // Function to toggle and save language
  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'ta' : 'en';
    setLanguage(newLang);
    await Preferences.set({ key: 'language', value: newLang });
  };

  // The translation function
  const t = (key: string): string => {
    // If the key exists in dictionary, return the translated string
    // If not, return the key itself (fallback)
    return dictionary[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for easy access
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}