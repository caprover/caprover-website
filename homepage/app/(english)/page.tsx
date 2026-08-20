import { localizedMetadata } from "@/i18n/metadata";
import { HomePage } from "@/app/home-page";

export const metadata = localizedMetadata(
  "en",
  "/",
  "homepage.metadata.title",
  "homepage.metadata.description",
);

export default function Home() {
  return <HomePage locale="en" />;
}
