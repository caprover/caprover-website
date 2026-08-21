import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Locale } from "@/i18n/config";
import "./globals.css";
import "@/features/comparison/comparison.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const iconPath = `${basePath}/homepage-assets/caprover-logo.png`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const rootMetadata: Metadata = {
  icons: {
    icon: iconPath,
    shortcut: iconPath,
    apple: iconPath,
  },
};

export function RootDocument({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
