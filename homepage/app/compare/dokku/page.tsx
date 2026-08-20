import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { DokkuComparisonPage } from "./page-content";

export const metadata: Metadata = {
  ...englishMessages.comparisonPages.dokku.metadata,
  alternates: { canonical: "https://caprover.com/compare/dokku/" },
};

export default function DokkuComparison() {
  return <DokkuComparisonPage />;
}
