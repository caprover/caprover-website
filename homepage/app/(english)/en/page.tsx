import { pageMetadata } from "@/i18n/metadata";
import { HomePage } from "@/app/home-page";

export const metadata = {
  ...pageMetadata("en", "home"),
  robots: { index: false, follow: true },
};

export default function EnglishHomepageAlias() {
  return <HomePage locale="en" />;
}
