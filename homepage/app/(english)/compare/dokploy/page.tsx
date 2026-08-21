import { localizedMetadata } from "@/i18n/metadata";
import { DokployComparisonPage } from "./page-content";

export const metadata = localizedMetadata("en", "/compare/dokploy/", "comparisonPages.dokploy.metadata.title", "comparisonPages.dokploy.metadata.description");

export default function DokployComparison() {
  return <DokployComparisonPage />;
}
