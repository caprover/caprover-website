import type { Metadata } from "next";
import { getFlatMessages, type MessageKey } from "./messages";
import type { Locale } from "./config";

const SITE = "https://caprover.com";

const PAGE_METADATA = {
  home: {
    path: "/",
    titleKey: "homepage.metadata.title",
    descriptionKey: "homepage.metadata.description",
  },
  comparisonHub: {
    path: "/compare/",
    titleKey: "comparisonPages.hub.metadata.title",
    descriptionKey: "comparisonPages.hub.metadata.description",
  },
  coolify: {
    path: "/compare/coolify/",
    titleKey: "comparisonPages.coolify.metadata.title",
    descriptionKey: "comparisonPages.coolify.metadata.description",
  },
  dokploy: {
    path: "/compare/dokploy/",
    titleKey: "comparisonPages.dokploy.metadata.title",
    descriptionKey: "comparisonPages.dokploy.metadata.description",
  },
  dokku: {
    path: "/compare/dokku/",
    titleKey: "comparisonPages.dokku.metadata.title",
    descriptionKey: "comparisonPages.dokku.metadata.description",
  },
} as const satisfies Record<
  string,
  {
    path: string;
    titleKey: MessageKey;
    descriptionKey: MessageKey;
  }
>;

export type LocalizedPage = keyof typeof PAGE_METADATA;

function localizedMetadata(
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

export function pageMetadata(
  locale: Locale,
  page: LocalizedPage,
): Metadata {
  const { path, titleKey, descriptionKey } = PAGE_METADATA[page];
  return localizedMetadata(locale, path, titleKey, descriptionKey);
}
