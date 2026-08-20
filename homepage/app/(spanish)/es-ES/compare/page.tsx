import { ComparisonHubPage } from "@/app/(english)/compare/page-content";
import { localizedMetadata } from "@/i18n/metadata";

export const metadata = localizedMetadata("es-ES", "/compare/", "comparisonPages.hub.metadata.title", "comparisonPages.hub.metadata.description");

export default function SpanishComparisonHub() {
  return <ComparisonHubPage locale="es-ES" />;
}
