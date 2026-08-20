import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { DokkuComparisonPage } from "./page-content";

export const metadata: Metadata = {
  title: englishMessages["comparisonPages.dokku.metadata.title"],
  description: englishMessages["comparisonPages.dokku.metadata.description"],
  alternates: { canonical: "https://caprover.com/compare/dokku/" },
};

export default function DokkuComparison() {
  return <DokkuComparisonPage />;
}
