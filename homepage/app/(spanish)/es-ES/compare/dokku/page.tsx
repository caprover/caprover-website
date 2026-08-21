import { DokkuComparisonPage } from "@/app/(english)/compare/dokku/page-content";
import { localizedMetadata } from "@/i18n/metadata";

export const metadata = localizedMetadata("es-ES", "/compare/dokku/", "comparisonPages.dokku.metadata.title", "comparisonPages.dokku.metadata.description");

export default function SpanishDokkuComparison() {
  return <DokkuComparisonPage locale="es-ES" />;
}
