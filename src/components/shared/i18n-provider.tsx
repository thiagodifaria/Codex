
'use client';

import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n';
import type React from 'react';
import { useEffect, useState } from 'react';

interface I18nAppProviderProps {
  children: React.ReactNode;
}

export function I18nAppProvider({ children }: I18nAppProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleLanguageChanged = (lng: string) => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lng;
      }
    };
    i18nInstance.on('languageChanged', handleLanguageChanged);
    
    if (i18nInstance.resolvedLanguage) {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = i18nInstance.resolvedLanguage;
      }
    }
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  if (!isClient) {
    
    return null; 
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
