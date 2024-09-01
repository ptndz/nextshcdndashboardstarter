import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} overflow-hidden `}>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <TooltipProvider delayDuration={50}>
            <Toaster />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
