import type { Metadata } from "next";
import { getFlatMessages, type MessageKey } from "./messages";
import type { Locale } from "./config";

const SITE = "https://caprover.com";

export function localizedMetadata(
  locale: Locale,
  path: string,
  titleKey: MessageKey,
  descriptionKey: MessageKey,
): Metadata {
  const messages = getFlatMessages(locale);
  const englishUrl = `${SITE}${path}`;
  const spanishUrl = `${SITE}/es-ES${path}`;
  const canonical = locale === "en" ? englishUrl : spanishUrl;

  return {
    title: messages[titleKey],
    description: messages[descriptionKey],
    alternates: {
      canonical,
      languages: {
        en: englishUrl,
        "es-ES": spanishUrl,
        "x-default": englishUrl,
      },
    },
  };
}
