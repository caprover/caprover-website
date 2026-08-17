import type { Metadata } from "next";
import { RootChrome } from "@/components/RootChrome";
import { alternateLanguages, asset, getHomeMessages } from "@/lib/i18n";

const messages = getHomeMessages("zh-CN");
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
    canonical: "https://caprover.com/zh-CN/",
    languages: alternateLanguages("/"),
  },
};

export default function ChineseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootChrome locale="zh-CN">{children}</RootChrome>;
}
