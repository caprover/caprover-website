import { localizedMetadata } from "@/i18n/metadata";
import { CoolifyComparisonPage } from "./page-content";

export const metadata = localizedMetadata("en", "/compare/coolify/", "comparisonPages.coolify.metadata.title", "comparisonPages.coolify.metadata.description");

export default function CoolifyComparison() {
  return <CoolifyComparisonPage />;
}
