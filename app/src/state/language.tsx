import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'ar';

const LANGUAGE_KEY = 'app-language';

type LanguageState = {
  language: Language;
  /** True for Arabic: layouts read right to left. */
  rtl: boolean;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageState>({ language: 'en', rtl: false, setLanguage: () => {} });

/**
 * The language picked on the first onboarding screen, remembered on the phone.
 * Screens with Arabic copy (Home so far) flip right to left in place, without restarting the app.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((saved) => {
        if (saved === 'ar' || saved === 'en') setLanguageState(saved);
      })
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      language,
      rtl: language === 'ar',
      setLanguage(next: Language) {
        setLanguageState(next);
        AsyncStorage.setItem(LANGUAGE_KEY, next).catch(() => {});
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

const RtlContext = createContext(false);

/** Marks a part of the screen as right to left, so chevrons and arrows inside it point the other way. */
export function RtlScope({ rtl, children }: { rtl: boolean; children: ReactNode }) {
  return <RtlContext.Provider value={rtl}>{children}</RtlContext.Provider>;
}

export function useRtlScope() {
  return useContext(RtlContext);
}
