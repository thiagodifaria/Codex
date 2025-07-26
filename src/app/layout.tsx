
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeInitializer } from '@/components/shared/theme-initializer';
import React from 'react';
import { I18nAppProvider } from '@/components/shared/i18n-provider';

export const metadata: Metadata = {
  title: 'Codex - Seu centro de produtividade pessoal',
  description: 'Gerencie seu diário, tarefas, projetos e metas com o Codex.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeInitializer />
        <I18nAppProvider>
          {children}
        </I18nAppProvider>
        <Toaster />
      </body>
    </html>
  );
}
