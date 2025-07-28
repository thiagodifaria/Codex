
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
      } else { 
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyInitialTheme();

    
    
  }, []);

  return null; 
}
