import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import { getMessages, messageList } from "../../i18n/messages";

export type Product = "caprover" | "dokploy" | "dokku" | "coolify";

export type ComparisonStatus = "yes" | "partial" | "no";

export type ComparisonValue = {
  status: ComparisonStatus;
  note?: string;
};

export type ComparisonRow = {
  feature: string;
  caprover: ComparisonValue;
  dokploy: ComparisonValue;
  dokku: ComparisonValue;
  coolify: ComparisonValue;
};

export type PairwiseRow = {
  feature: string;
  caprover: ComparisonValue;
  competitor: ComparisonValue;
};

export function getComparisonData(locale: Locale = DEFAULT_LOCALE) {
  const messages = getMessages(locale);

  return {
    products: messageList(messages.comparisonData.products) as Array<{ key: Product; label: string }>,
    rows: messageList(messages.comparisonData.rows) as ComparisonRow[],
    verifiedDate: messages.comparisonCommon.verifiedDate,
  };
}
