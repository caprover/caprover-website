import type { Locale } from "./config";
import comparisonCommon from "./messages/en/comparison-common.json";
import comparisonCoolify from "./messages/en/comparison-coolify.json";
import comparisonData from "./messages/en/comparison-data.json";
import comparisonDokku from "./messages/en/comparison-dokku.json";
import comparisonDokploy from "./messages/en/comparison-dokploy.json";
import comparisonHub from "./messages/en/comparison-hub.json";
import homepage from "./messages/en/homepage.json";

export const englishMessages = {
  homepage,
  comparisonCommon,
  comparisonData,
  comparisonPages: {
    hub: comparisonHub,
    coolify: comparisonCoolify,
    dokploy: comparisonDokploy,
    dokku: comparisonDokku,
  },
};

export type Messages = typeof englishMessages;

const messagesByLocale: Record<Locale, Messages> = {
  en: englishMessages,
};

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}
