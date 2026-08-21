import { CoolifyComparisonPage } from "@/features/comparison/coolify/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("es-ES", "coolify");

export default function SpanishCoolifyComparison() {
  return <CoolifyComparisonPage locale="es-ES" />;
}
