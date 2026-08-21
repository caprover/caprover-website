import { localizedMetadata } from "@/i18n/metadata";
import { HomePage } from "@/app/home-page";

export const metadata = {
  ...localizedMetadata("en", "/", "homepage.metadata.title", "homepage.metadata.description"),
  robots: { index: false, follow: true },
};

export default function EnglishHomepageAlias() {
  return <HomePage locale="en" />;
}
