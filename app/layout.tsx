import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/providers';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lenormand Intelligence',
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
      <head>
        <script type="text/javascript">
          {`
            (
              function() {
                  try {
                    if(window.location && window.location.search && window.location.search.indexOf('capture-sitebehaviour-heatmap') !== -1) {
                      sessionStorage.setItem('capture-sitebehaviour-heatmap', '_');
                    }
               
                    var sbSiteSecret = 'ff6ff176-cabd-44f9-a10e-d5df8b4500af';
                    window.sitebehaviourTrackingSecret = sbSiteSecret;
                    var scriptElement = document.createElement('script');
                    scriptElement.defer = true;
                    scriptElement.id = 'site-behaviour-script-v2';
                    scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret= ' + sbSiteSecret;
                    document.head.appendChild(scriptElement);
                  }
                  catch (e) {console.error(e)}
              }
            )()
          `}
        </script>
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-grow pt-14">
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