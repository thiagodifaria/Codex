
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { SidebarNav } from './sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <Logo size={28} />
          <span className="text-xl font-semibold font-headline group-data-[collapsible=icon]:hidden">
            {t('appName')}
          </span>
        </SidebarHeader>
        <SidebarContent className="p-2 min-h-0">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto">
          <Separator className="my-2" />
          <Link href="/profile" passHref legacyBehavior>
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square">
              <a>
                <UserCircle className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">{t('profile')}</span>
              </a>
            </Button>
          </Link>
          <Link href="/settings" passHref legacyBehavior>
            <Button asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square">
              <a>
                <Settings className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">{t('settings')}</span>
              </a>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square text-destructive hover:text-destructive-foreground hover:bg-destructive"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <LogOut className="mr-2 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">{t('logout')}</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
