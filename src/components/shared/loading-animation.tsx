import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  size?: number;
  className?: string;
  fullPage?: boolean;
}

export default function LoadingAnimation({ size = 32, className, fullPage = false }: LoadingAnimationProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-[9999]" data-testid="loading-fullpage">
        <Loader2 className={`animate-spin text-primary ${className}`} size={size * 1.5} />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center p-4 ${className}`} data-testid="loading-inline">
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
}
