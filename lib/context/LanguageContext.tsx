'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';
import { arContent } from '@/content/ar';
import { enContent } from '@/content/en';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof arContent;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  const applyDocumentAttributes = (targetLang: Language) => {
    if (typeof window !== 'undefined') {
      const direction = targetLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = targetLang;
    }
  };

  const saveLanguagePreference = (newLang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        localStorage.setItem('nilorigen_language', newLang);
        localStorage.setItem('lang', newLang);
      } catch (e) {
        console.error('Failed to save language to localStorage:', e);
      }
    }
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    saveLanguagePreference(newLang);
  };

  useEffect(() => {
    try {
      const savedLang =
        localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
        localStorage.getItem('nilorigen_language') ||
        localStorage.getItem('lang');
      if (savedLang === 'ar' || savedLang === 'en') {
        setLangState(savedLang);
      }
    } catch (error) {
      console.error('Failed to sync language on mount:', error);
    }
  }, []);

  useEffect(() => {
    applyDocumentAttributes(lang);
  }, [lang]);

  const t = lang === 'ar' ? arContent : enContent;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir} className={lang === 'ar' ? 'font-arabic' : 'font-english'} suppressHydrationWarning>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
