
'use client';
import PageWrapper from "@/components/layout/page-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCircle, AtSign } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const username = "test_user#1234"; 
  const [displayName, setDisplayName] = useState(t('profile_default_display_name'));
  const [bio, setBio] = useState(t('profile_default_bio'));
  // Email is usually not directly editable by user after creation for security/identity reasons
  const email = "user@example.com";

  return (
    <PageWrapper title={t('page_title_profile')}>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <UserCircle className="w-6 h-6 mr-2" />
              {t('profile_your_avatar_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src="https://placehold.co/200x200.png" alt={t('profile_your_avatar_title')} data-ai-hint="profile avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">{t('profile_change_avatar_button')}</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">{t('profile_account_details_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('profile_username_label')}</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                <AtSign className="w-4 h-4 text-muted-foreground" />
                <span id="username" className="text-sm font-medium text-foreground">
                  {username}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t('profile_username_unchangeable_notice')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('profile_display_name_label')}</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('profile_default_display_name')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile_email_label')}</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile_bio_label')}</Label>
              <textarea
                id="bio"
                className="w-full p-2 border rounded-md bg-input min-h-[100px]"
                placeholder={t('profile_bio_placeholder')}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button>{t('profile_save_changes_button')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">{t('profile_password_security_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">{t('profile_change_password_button')}</Button>
            <p className="text-sm text-muted-foreground">
              {t('profile_password_security_notice')}
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
    
