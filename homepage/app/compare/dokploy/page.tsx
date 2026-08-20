import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { DokployComparisonPage } from "./page-content";

export const metadata: Metadata = {
  title: englishMessages["comparisonPages.dokploy.metadata.title"],
  description: englishMessages["comparisonPages.dokploy.metadata.description"],
  alternates: { canonical: "https://caprover.com/compare/dokploy/" },
};

export default function DokployComparison() {
  return <DokployComparisonPage />;
}
