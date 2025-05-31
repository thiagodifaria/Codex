import type React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  titleClassName?: string;
}

export default function PageWrapper({ children, title, className, titleClassName }: PageWrapperProps) {
  return (
    <div className={`p-4 sm:p-6 md:p-8 space-y-6 ${className}`}>
      {title && (
        <h1 className={`text-2xl sm:text-3xl font-headline font-semibold text-foreground ${titleClassName}`}>
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
