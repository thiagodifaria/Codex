
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/common.json';
import esTranslations from '../locales/es/common.json';
import ptBRTranslations from '../locales/pt-BR/common.json';

export const supportedLngs = {
  en: 'English (United States)',
  es: 'Español (España)',
  'pt-BR': 'Português (Brasil)',
};

const resources = {
  en: {
    common: enTranslations,
  },
  es: {
    common: esTranslations,
  },
  'pt-BR': {
    common: ptBRTranslations,
  },
};

const i18nChain = i18n.use(initReactI18next);


if (typeof window !== 'undefined') {
  i18nChain.use(LanguageDetector);
}

i18nChain.init({
  resources,
  fallbackLng: 'en',
  
  supportedLngs: Object.keys(supportedLngs),
  interpolation: {
    escapeValue: false, 
  },
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'codex-i18nextLng',
  },
  ns: ['common'],
  defaultNS: 'common',
});

export default i18n;
