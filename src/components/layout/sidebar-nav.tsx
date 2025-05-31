
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS_CONFIG } from '@/lib/constants';
import type { NavItemConfig } from '@/types/codex';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  return (
    <SidebarMenu>
      {NAV_ITEMS_CONFIG.map((item: NavItemConfig) => (
        <SidebarMenuItem key={item.href} data-testid={`nav-${item.titleKey.toLowerCase().replace('_', '-')}`}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              tooltip={t(item.titleKey)}
              disabled={item.disabled}
              className="justify-start"
            >
              <a>
                <item.icon />
                <span>{t(item.titleKey)}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
