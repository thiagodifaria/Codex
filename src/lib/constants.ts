
import type { NavItemConfig } from '@/types/codex';
import { LayoutDashboard, BookOpenText, ListChecks, Briefcase, Target, NotebookPen } from 'lucide-react';

export const LOGO_ICON = NotebookPen; // This remains as is, icon component.

export const NAV_ITEMS_CONFIG: NavItemConfig[] = [
  {
    titleKey: 'nav_dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'nav_journal',
    href: '/journal',
    icon: BookOpenText,
  },
  {
    titleKey: 'nav_todo_global',
    href: '/todo',
    icon: ListChecks,
  },
  {
    titleKey: 'nav_projects',
    href: '/projects',
    icon: Briefcase,
  },
  {
    titleKey: 'nav_goals',
    href: '/goals',
    icon: Target,
  },
];
