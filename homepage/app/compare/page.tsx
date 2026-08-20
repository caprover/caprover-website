import type { Metadata } from "next";
import { englishMessages } from "../../i18n/messages";
import { ComparisonHubPage } from "./page-content";

export const metadata: Metadata = {
  ...englishMessages.comparisonPages.hub.metadata,
  alternates: { canonical: "https://caprover.com/compare/" },
};

export default function ComparisonHub() {
  return <ComparisonHubPage />;
}
