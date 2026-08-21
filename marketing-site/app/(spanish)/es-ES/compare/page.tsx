import { ComparisonHubPage } from "@/features/comparison/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("es-ES", "comparisonHub");

export default function SpanishComparisonHub() {
  return <ComparisonHubPage locale="es-ES" />;
}
