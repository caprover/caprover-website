import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { CoolifyComparisonPage } from "./page-content";

export const metadata: Metadata = {
  title: englishMessages["comparisonPages.coolify.metadata.title"],
  description: englishMessages["comparisonPages.coolify.metadata.description"],
  alternates: { canonical: "https://caprover.com/compare/coolify/" },
};

export default function CoolifyComparison() {
  return <CoolifyComparisonPage />;
}
