import { pageMetadata } from "@/i18n/metadata";
import { HomePage } from "@/app/home-page";

export const metadata = pageMetadata("en", "home");

export default function Home() {
  return <HomePage locale="en" />;
}
