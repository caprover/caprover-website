import type { Metadata } from "next";
import routes from "../routes.json";
import { getFlatMessages, type MessageKey } from "./messages";
import {
  DEFAULT_LOCALE,
  ENABLED_LOCALES,
  localizedPath,
  type Locale,
} from "./config";

const SITE = "https://caprover.com";

const PAGE_METADATA = {
  home: {
    path: routes.home.path,
    titleKey: "homepage.metadata.title",
    descriptionKey: "homepage.metadata.description",
  },
  comparisonHub: {
    path: routes.comparisonHub.path,
    titleKey: "comparisonPages.hub.metadata.title",
    descriptionKey: "comparisonPages.hub.metadata.description",
  },
  coolify: {
    path: routes.coolify.path,
    titleKey: "comparisonPages.coolify.metadata.title",
    descriptionKey: "comparisonPages.coolify.metadata.description",
  },
  dokploy: {
    path: routes.dokploy.path,
    titleKey: "comparisonPages.dokploy.metadata.title",
    descriptionKey: "comparisonPages.dokploy.metadata.description",
  },
  dokku: {
    path: routes.dokku.path,
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
  const defaultUrl = `${SITE}${localizedPath(path, DEFAULT_LOCALE)}`;
  const canonical = `${SITE}${localizedPath(path, locale)}`;
  const languages = Object.fromEntries(
    ENABLED_LOCALES.map((entry) => [
      entry.code,
      `${SITE}${localizedPath(path, entry.code)}`,
    ]),
  );

  return {
    title: messages[titleKey],
    description: messages[descriptionKey],
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": defaultUrl,
      },
    },
  };
}

export function pageMetadata(locale: Locale, page: LocalizedPage): Metadata {
  const { path, titleKey, descriptionKey } = PAGE_METADATA[page];
  return localizedMetadata(locale, path, titleKey, descriptionKey);
}
