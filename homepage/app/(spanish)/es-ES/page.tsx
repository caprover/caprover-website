import { HomePage } from "@/app/home-page";
import { pageMetadata } from "@/i18n/metadata";

export const metadata = pageMetadata("es-ES", "home");

export default function SpanishHomepage() {
  return <HomePage locale="es-ES" />;
}
