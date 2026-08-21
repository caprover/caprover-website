import { HomePage } from "@/app/home-page";
import { localizedMetadata } from "@/i18n/metadata";

export const metadata = localizedMetadata("es-ES", "/", "homepage.metadata.title", "homepage.metadata.description");

export default function SpanishHomepage() {
  return <HomePage locale="es-ES" />;
}
