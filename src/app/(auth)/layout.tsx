import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Codex',
  description: 'Login or Sign up to Codex.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
