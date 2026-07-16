import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "CapRover · Scalable, Free and Self-hosted PaaS",
  description:
    "Deploy and manage apps on your own infrastructure with CapRover, the free and open-source PaaS built on Docker.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: iconPath,
    shortcut: iconPath,
    apple: iconPath,
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
        {children}
      </body>
    </html>
  );
}
