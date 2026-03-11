export const fallbackLng = "en" as const;
export const supportedLngs = ["en", "de", "fr", "ja", "ar"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

/** Display in language selector: flag + name in the language’s own name (e.g. "English" not "Anglais"). */
export const languageDisplay: Record<
  SupportedLng,
  { flag: string; nativeName: string }
> = {
  en: { flag: "🇺🇸", nativeName: "English" },
  de: { flag: "🇩🇪", nativeName: "Deutsch" },
  fr: { flag: "🇫🇷", nativeName: "Français" },
  ja: { flag: "🇯🇵", nativeName: "日本語" },
  ar: { flag: "🇸🇦", nativeName: "العربية" },
};

/** Languages that use right-to-left script; layout and dir are set accordingly. */
export const rtlLngs = ["ar"] as const;
export type RtlLng = (typeof rtlLngs)[number];

export function isRtl(lng: string): boolean {
  return rtlLngs.includes(lng as RtlLng);
}

export const defaultNS = "common" as const;
export const namespaces = ["common", "home", "layout", "journey", "job"] as const;
export type Namespace = (typeof namespaces)[number];

export const i18nConfig = {
  fallbackLng,
  supportedLngs: [...supportedLngs],
  ns: [...namespaces],
  defaultNS,
  interpolation: {
    escapeValue: false, // React already escapes
  },
  detection: {
    order: ["localStorage", "navigator", "htmlTag"] as string[],
    caches: ["localStorage"] as string[],
    lookupLocalStorage: "i18nextLng",
  },
  // Prevent missing keys from showing key path in production
  returnEmptyString: false,
  ...(typeof window !== "undefined" && process.env.NODE_ENV === "development"
    ? {
        saveMissing: false,
        missingKeyHandler: (
          lngs: readonly string[],
          ns: string,
          key: string,
          fallbackValue: string,
          _updateMissing: boolean,
          _options: unknown
        ) => {
          console.warn(`[i18n] Missing translation: ${key}`, { fallbackValue, ns, lngs });
        },
      }
    : {}),
};
