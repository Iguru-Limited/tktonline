import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // This import is for side effects (CSS styles)
import Head from 'next/head';
import { SearchProvider } from "@/contexts/SearchContext";
import { BookingProvider } from "@/contexts/BookingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tkt.ke",
  description: "Buy travel tickets online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="application-name" content="tkt.ke" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="tkt" />
        <meta name="description" content="online travel tickets" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="tkt.ke" />
        <meta name="twitter:description" content="online travel tickets" />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="tkt.ke" />
        <meta property="og:description" content="online travel tickets" />
        <meta property="og:site_name" content="tkt.ke" />
        <meta property="og:image" content="/icons/icon-192x192.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <BookingProvider>
            {children}
            <Toaster/>
          </BookingProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
