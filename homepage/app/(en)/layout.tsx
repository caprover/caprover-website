import type { Metadata } from "next";
import { RootChrome } from "@/components/RootChrome";
import { alternateLanguages, asset, getHomeMessages } from "@/lib/i18n";

const messages = getHomeMessages("en");
const iconPath = asset("/caprover-logo.png");

export const metadata: Metadata = {
  title: messages.metaTitle,
  description: messages.metaDescription,
  icons: {
    icon: iconPath,
    shortcut: iconPath,
    apple: iconPath,
  },
  alternates: {
    canonical: "https://caprover.com/",
    languages: alternateLanguages("/"),
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootChrome locale="en">{children}</RootChrome>;
}
