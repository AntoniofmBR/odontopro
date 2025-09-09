import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SessionAuthProvider } from '@/components/session-auth';
import { Toaster } from '@/components/ui/sonner';

import "./globals.css";
import { QueryClientContext } from '@/providers/queryClient';

import logo from '../../public/logo-odonto.ico'

const getInter = Inter({
  variable: "--getInter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdontoPRO",
  description: "Find the best professionals in a single local!",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "OdontoPRO",
    description: "Find the best professionals in a single local!",
    images: [ `${ process.env.NEXT_PUBLIC_URL }/doctor-hero.png` ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href='favicon.ico' type="image/x-icon" />
      </head>
      <body
        className={`${ getInter.variable } antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster duration={ 2500 } />
            { children }
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
