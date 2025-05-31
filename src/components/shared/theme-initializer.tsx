
'use client';

import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyInitialTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else { // 'system' or no theme set
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyInitialTheme();

    // Este componente lida apenas com o carregamento inicial.
    // A SettingsPage lida com a escuta de mudanças do sistema se 'system' estiver selecionado.
  }, []);

  return null; // Este componente não renderiza nada visível
}
