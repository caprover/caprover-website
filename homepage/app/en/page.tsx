import type { Metadata } from "next";
import { HomePage } from "../home-page";

export const metadata: Metadata = {
  alternates: { canonical: "https://caprover.com/" },
  robots: { index: false, follow: true },
};

export default function EnglishHomepageAlias() {
  return <HomePage locale="en" />;
}
