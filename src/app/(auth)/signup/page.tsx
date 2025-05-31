
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation, Trans } from 'react-i18next';

const passwordValidation = new RegExp(
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/
);

const signupFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .max(20, { message: "Username must be at most 20 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores."})
    .refine(async (value) => { 
      await new Promise(resolve => setTimeout(resolve, 300)); 
      return value.toLowerCase() !== 'admin' && value.toLowerCase() !== 'testuser';
    }, { message: "Username already taken." }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Invalid email address." }),
  confirmEmail: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters."})
    .regex(passwordValidation, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."}),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters."}),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  acceptTerms: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions.",
  }),
  receivePromotions: z.boolean().optional(),
}).refine(data => data.email === data.confirmEmail, {
  message: "Emails do not match.",
  path: ["confirmEmail"],
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
      acceptTerms: false,
      receivePromotions: false,
    },
    mode: "onBlur" 
  });

  async function onSubmit(data: SignupFormValues) {
    if (data.email === "existing@example.com") {
      form.setError("email", { type: "manual", message: "This email is already registered." });
      return;
    }

    toast({
      title: "Account Creation Submitted",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    console.log("Signup data:", data);
    setTimeout(() => router.push('/login'), 2000);
  }

  return (
    <>
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2">
        <Logo size={28} />
        <span className="text-xl font-semibold">{t('appName')}</span>
      </div>
      <Card className="w-full max-w-lg shadow-xl my-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{t('signup_title')}</CardTitle>
          <CardDescription>
            <Trans i18nKey="signup_description" ns="common" values={{ appName: t('appName') }}>
              Join {{appName}} today! Fill in your details below.
            </Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_username_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup_username_placeholder')} {...field} data-testid="username-input"/>
                    </FormControl>
                    <FormDescription>
                      {t('signup_username_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_fullname_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup_fullname_placeholder')} {...field} data-testid="fullname-input"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_email_label')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('signup_email_placeholder')} {...field} data-testid="email-input"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_confirm_email_label')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('signup_confirm_email_placeholder')} {...field} data-testid="confirm-email-input"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_password_label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('signup_password_placeholder')} {...field} data-testid="password-input"/>
                    </FormControl>
                    <FormDescription>
                     {t('signup_password_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup_confirm_password_label')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('signup_confirm_password_placeholder')} {...field} data-testid="confirm-password-input"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('signup_dob_label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            data-testid="dob-trigger"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('signup_dob_placeholder')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="terms-checkbox"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <Trans i18nKey="signup_accept_terms_label" ns="common"
                               components={{ 
                                 1: <Link href="/terms" className="text-primary hover:underline" />,
                                 3: <Link href="/privacy" className="text-primary hover:underline" /> 
                               }} />
                      </FormLabel>
                       <FormMessage className="!mt-1" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receivePromotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="promotions-checkbox"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <Trans i18nKey="signup_receive_promotions_label" ns="common" values={{ appName: t('appName')}} />
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} data-testid="signup-submit-btn">
                {form.formState.isSubmitting ? t('signup_submit_button_submitting') : t('signup_submit_button')}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Trans i18nKey="signup_login_prompt" ns="common"
                   components={{ 1: <Link href="/login" className="font-medium text-primary hover:underline" data-testid="login-link-from-signup" /> }} />
          </p>
        </CardContent>
      </Card>
       <p className="mt-8 px-8 text-center text-xs text-muted-foreground max-w-md">
        <Trans i18nKey="signup_terms_notice" ns="common" values={{ appName: t('appName') }} />
      </p>
    </>
  );
}
