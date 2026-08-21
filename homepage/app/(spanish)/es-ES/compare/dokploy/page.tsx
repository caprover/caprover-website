import { DokployComparisonPage } from "@/app/(english)/compare/dokploy/page-content";
import { localizedMetadata } from "@/i18n/metadata";

export const metadata = localizedMetadata("es-ES", "/compare/dokploy/", "comparisonPages.dokploy.metadata.title", "comparisonPages.dokploy.metadata.description");

export default function SpanishDokployComparison() {
  return <DokployComparisonPage locale="es-ES" />;
}
