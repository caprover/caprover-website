import { CoolifyComparisonPage } from "@/app/(english)/compare/coolify/page-content";
import { localizedMetadata } from "@/i18n/metadata";

export const metadata = localizedMetadata("es-ES", "/compare/coolify/", "comparisonPages.coolify.metadata.title", "comparisonPages.coolify.metadata.description");

export default function SpanishCoolifyComparison() {
  return <CoolifyComparisonPage locale="es-ES" />;
}
