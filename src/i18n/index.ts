import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "./config";
import type { TypedT, TranslationKey } from "./types";

const loadPath = "/locales/web/{{lng}}/{{ns}}.json";

/**
 * Initialize i18n. Call only on the client (e.g. from I18nProvider useEffect).
 * Safe to call multiple times; skips if already initialized.
 */
export async function initI18n(): Promise<typeof i18n> {
  if (i18n.isInitialized) {
    return i18n;
  }
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next);
  await i18n.init({
    ...i18nConfig,
    backend: { loadPath },
  });
  return i18n;
}

export { i18n };

/**
 * Type-safe translation hook. Use dot-notation keys: "feature.section.key".
 * Namespace is derived from the first segment (e.g. "home.intro.title" -> ns "home").
 */
export function useT(): TypedT {
  const { t } = useTranslation(["common", "home", "layout", "journey", "job"]);
  return ((key: TranslationKey, options?) => {
    const [ns, ...parts] = key.split(".");
    const keyInNs = parts.join(".");
    return t(keyInNs, { ns, ...options }) as string;
  }) as TypedT;
}
