import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { DokployComparisonPage } from "./page-content";

export const metadata: Metadata = {
  ...englishMessages.comparisonPages.dokploy.metadata,
  alternates: { canonical: "https://caprover.com/compare/dokploy/" },
};

export default function DokployComparison() {
  return <DokployComparisonPage />;
}
