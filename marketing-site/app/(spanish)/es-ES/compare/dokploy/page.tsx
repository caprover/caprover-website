import { DokployComparisonPage } from "@/features/comparison/dokploy/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("es-ES", "dokploy");

export default function SpanishDokployComparison() {
  return <DokployComparisonPage locale="es-ES" />;
}
