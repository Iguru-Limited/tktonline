import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tkt.ke'),
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-152x152.png" }],
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

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
