import { Suspense } from 'react';

import { Roboto } from 'next/font/google';

import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { AuthContextProvider } from '@/context/AuthContext';

import Loading from './loading';

export const metadata = {
  title: 'switchbacks',
  description: 'trail talk begins here',
};

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="/icon-1024.png" type="image/png" sizes="1024x1024" />
      </head>
      <body className={roboto.className}>
        <Suspense fallback={<Loading />}>
          <ThemeRegistry>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ThemeRegistry>
        </Suspense>
      </body>
    </html>
  );
}
