import { DokkuComparisonPage } from "@/features/comparison/dokku/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("es-ES", "dokku");

export default function SpanishDokkuComparison() {
  return <DokkuComparisonPage locale="es-ES" />;
}
