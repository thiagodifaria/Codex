
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('common');
  return (
    <>
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2">
        <Logo size={28} />
        <span className="text-xl font-semibold">{t('appName')}</span>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{t('forgot_password_title')}</CardTitle>
          <CardDescription>{t('forgot_password_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('forgot_password_message')}
          </p>
          <Button asChild variant="outline">
            <Link href="/login">{t('forgot_password_back_to_login_button')}</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
