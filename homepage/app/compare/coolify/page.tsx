import type { Metadata } from "next";
import { englishMessages } from "../../../i18n/messages";
import { CoolifyComparisonPage } from "./page-content";

export const metadata: Metadata = {
  ...englishMessages.comparisonPages.coolify.metadata,
  alternates: { canonical: "https://caprover.com/compare/coolify/" },
};

export default function CoolifyComparison() {
  return <CoolifyComparisonPage />;
}
