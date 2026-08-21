import { DokkuComparisonPage } from "@/features/comparison/dokku/page-content";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("en", "dokku");

export default function DokkuComparison() {
  return <DokkuComparisonPage />;
}
