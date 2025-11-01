import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lenormand.dk - Danish & English Lenormand Readings',
  description: 'Discover guidance and insight through mystical Lenormand cards. Create personalized readings, explore card meanings, and unlock wisdom of the 36-card deck.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <script src="https://cdn.jsdelivr.net/gh/IdeavoAI/ideavo-scripts@latest/scripts/ideavo.min.js"></script>
      </body>
    </html>
  );
}
