import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  description: "online travel tickets",
  applicationName: "tkt.ke",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "tkt",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  twitter: {
    card: "summary",
    title: "tkt.ke",
    description: "online travel tickets",
    images: ["/icons/icon-192x192.png"],
  },
  openGraph: {
    type: "website",
    title: "tkt.ke",
    description: "online travel tickets",
    siteName: "tkt.ke",
    images: ["/icons/icon-192x192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
