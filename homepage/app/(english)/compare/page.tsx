import { localizedMetadata } from "@/i18n/metadata";
import { ComparisonHubPage } from "./page-content";

export const metadata = localizedMetadata("en", "/compare/", "comparisonPages.hub.metadata.title", "comparisonPages.hub.metadata.description");

export default function ComparisonHub() {
  return <ComparisonHubPage />;
}
