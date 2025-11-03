import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lenormand.dk - Danish & English Lenormand Readings',
  description: 'Discover guidance and insight through mystical Lenormand cards. Create personalized readings, explore card meanings, and unlock wisdom of the 36-card deck.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-amber-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-900/60">
              <div className="container flex h-14 items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                    Lenormand Intelligence
                  </h1>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
