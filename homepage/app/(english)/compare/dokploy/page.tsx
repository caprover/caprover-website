import { DokployComparisonPage } from "@/features/comparison/dokploy/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("en", "dokploy");

export default function DokployComparison() {
  return <DokployComparisonPage />;
}
