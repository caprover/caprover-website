import { localizedMetadata } from "@/i18n/metadata";
import { DokkuComparisonPage } from "./page-content";

export const metadata = localizedMetadata("en", "/compare/dokku/", "comparisonPages.dokku.metadata.title", "comparisonPages.dokku.metadata.description");

export default function DokkuComparison() {
  return <DokkuComparisonPage />;
}
