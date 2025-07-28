
"use client"; 

import React, { useState, useEffect } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Palette, Languages, ShieldCheck, Trash2, FileText, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '@/lib/i18n';


type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const { t, i18n } = useTranslation('common');
  const [isManageDataAlertOpen, setIsManageDataAlertOpen] = useState(false);
  const [isDeleteAccountAlertOpen, setIsDeleteAccountAlertOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme) return storedTheme;
      
      
      
    }
    return 'system'; 
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (themeToApply: Theme) => {
      const isSystemCurrentlyDark = mediaQuery.matches;

      if (themeToApply === "dark") {
        root.classList.add("dark");
      } else if (themeToApply === "light") {
        root.classList.remove("dark");
      } else { 
        root.classList.remove("dark"); 
        if (isSystemCurrentlyDark) {
          root.classList.add("dark");
        }
      }
    };

    applyTheme(currentTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", currentTheme);
    }

    const mediaQueryListener = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") { 
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", mediaQueryListener);
    
    return () => {
      mediaQuery.removeEventListener("change", mediaQueryListener);
    };
  }, [currentTheme]);

  useEffect(() => {
    
     if (i18n.language && i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language.split('-')[0]); 
    }
  }, [i18n.language, currentLanguage]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  const handleConfirmDeleteAccount = () => {
    console.log("Account deletion confirmed. Implement actual deletion logic here.");
    alert("Account Deletion Confirmed (Simulated). This would delete the account in a real app.");
    setIsDeleteAccountAlertOpen(false);
  };

  return (
    <PageWrapper title={t('page_title_settings')}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('settings_notifications_title')}</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>{t('settings_email_notifications_label')}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t('settings_email_notifications_description')}
                </span>
              </Label>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                <span>{t('settings_push_notifications_label')}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t('settings_push_notifications_description')}
                </span>
              </Label>
              <Switch id="pushNotifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('settings_appearance_title')}</CardTitle>
            <Palette className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">{t('settings_theme_label')}</Label>
              <Select value={currentTheme} onValueChange={(value: Theme) => setCurrentTheme(value)}>
                <SelectTrigger id="theme" data-testid="theme-select-trigger">
                  <SelectValue placeholder={t('settings_theme_select_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('theme_light')}</SelectItem>
                  <SelectItem value="dark">{t('theme_dark')}</SelectItem>
                  <SelectItem value="system">{t('theme_system')}</SelectItem>
                </SelectContent>
              </Select>
              <CardDescription className="text-xs mt-1">
                {t('settings_theme_description')}
              </CardDescription>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('settings_language_region_title')}</CardTitle>
            <Languages className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">{t('settings_language_label')}</Label>
              <Select value={currentLanguage.startsWith('pt') ? 'pt-BR' : currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language" data-testid="language-select-trigger">
                  <SelectValue placeholder={t('settings_select_language_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(supportedLngs).map(([lngCode, lngName]) => (
                    <SelectItem key={lngCode} value={lngCode}>
                      {lngName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="timezone">{t('settings_timezone_label')}</Label>
              <Select defaultValue="utc-3">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder={t('settings_select_timezone_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                  <SelectItem value="utc-3">Brasilia Time (UTC-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('settings_account_privacy_title')}</CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setIsManageDataAlertOpen(true)}>
                <FileText className="mr-2 h-4 w-4" /> {t('settings_manage_account_data_button')}
              </Button>
              <Button variant="outline" asChild>
                  <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
                    <ShieldCheck className="mr-2 h-4 w-4" /> {t('settings_privacy_policy_button')}
                  </a>
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteAccountAlertOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> {t('settings_delete_account_button')}
              </Button>
            </div>
            <CardDescription className="text-xs mt-1">
              {t('settings_account_privacy_description')}
            </CardDescription>
          </CardContent>
        </Card>

      </div>

      <AlertDialog open={isManageDataAlertOpen} onOpenChange={setIsManageDataAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings_manage_data_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings_manage_data_dialog_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsManageDataAlertOpen(false)}>{t('settings_manage_data_dialog_ok_button')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAccountAlertOpen} onOpenChange={setIsDeleteAccountAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" /> {t('settings_delete_account_dialog_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings_delete_account_dialog_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAccountAlertOpen(false)}>{t('common_cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {t('settings_delete_account_dialog_confirm_button')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}

    