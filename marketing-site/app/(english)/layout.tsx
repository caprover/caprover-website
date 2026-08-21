import { RootDocument, rootMetadata } from "@/app/root-document";

export const metadata = rootMetadata;

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
