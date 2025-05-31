import { LOGO_ICON } from '@/lib/constants';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
  const IconComponent = LOGO_ICON;
  return <IconComponent className={className} size={size} aria-label="Codex Logo" />;
}
