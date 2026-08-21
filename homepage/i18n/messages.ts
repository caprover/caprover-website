import englishCatalog from "../../content/en/website.json";
import spanishCatalog from "../../content/es-ES/website.json";

export const englishMessages = englishCatalog;

export type MessageKey = keyof typeof englishCatalog;
export type FlatMessages = Record<MessageKey, string>;

type PathObject<Path extends string> =
  Path extends `${infer Head}.${infer Tail}`
    ? { [Key in Head]: PathObject<Tail> }
    : { [Key in Path]: string };

type UnionToIntersection<Union> = (
  Union extends unknown ? (value: Union) => void : never
) extends (value: infer Intersection) => void
  ? Intersection
  : never;

export type Messages = UnionToIntersection<
  { [Key in MessageKey]: PathObject<Key> }[MessageKey]
>;

export const messagesByLocale = {
  en: englishCatalog,
  "es-ES": spanishCatalog,
} satisfies Record<string, FlatMessages>;

export type Locale = keyof typeof messagesByLocale;

const structuralKeys = (Object.keys(englishCatalog) as MessageKey[]).filter(
  (key) => key.endsWith(".key") || key.endsWith(".status"),
);

function expandMessages(flatMessages: FlatMessages): Messages {
  const normalizedMessages = { ...flatMessages };

  for (const key of structuralKeys) {
    normalizedMessages[key] = englishCatalog[key];
  }

  const expanded: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(normalizedMessages)) {
    const segments = path.split(".");
    let target = expanded;

    for (const segment of segments.slice(0, -1)) {
      target[segment] ??= {};
      target = target[segment] as Record<string, unknown>;
    }

    target[segments.at(-1)!] = value;
  }

  return expanded as Messages;
}

const expandedMessagesByLocale = Object.fromEntries(
  Object.entries(messagesByLocale).map(([locale, messages]) => [
    locale,
    expandMessages(messages),
  ]),
) as Record<Locale, Messages>;

export function getMessages(locale: Locale): Messages {
  return expandedMessagesByLocale[locale];
}

export function getFlatMessages(locale: Locale): FlatMessages {
  return messagesByLocale[locale];
}

export function messageList<Value>(messages: Record<string, Value>): Value[] {
  return Object.entries(messages)
    .sort(([left], [right]) =>
      left.localeCompare(right, undefined, { numeric: true }),
    )
    .map(([, value]) => value);
}
