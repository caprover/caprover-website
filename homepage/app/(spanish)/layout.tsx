import { RootDocument, rootMetadata } from "@/app/root-document";

export const metadata = rootMetadata;

export default function SpanishRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="es-ES">{children}</RootDocument>;
}
