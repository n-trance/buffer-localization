# Getting started

How to run the project, choose a language, and how the app handles translated text, dates, currency, and RTL.

## Start the project

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app wraps the UI in [I18nProvider](../src/components/I18nProvider.tsx), which initializes i18n and loads translations from `public/locales/web/{lng}/` by namespace.

```
  pnpm dev
       |
       v
  Next.js serves the app
       |
       v
  I18nProvider mounts --> initI18n() --> load /locales/web/{{lng}}/{{ns}}.json
       |
       v
  Language from localStorage ("i18nextLng") or browser language
```

## Selecting a language

The app shows a **language switcher** (e.g. in the nav) built from [LanguageSwitcher](../src/components/LanguageSwitcher.tsx). It lists all [supported languages](../src/i18n/config.ts): English, Deutsch, Français, 日本語, العربية.

```
  User picks a language in the dropdown
       |
       v
  i18n.changeLanguage(value)  (react-i18next)
       |
       v
  Language is stored in localStorage ("i18nextLng") and used for all new requests
       |
       v
  I18nProvider listens to "languageChanged" --> updates document.lang and document.dir (for RTL)
```

- **First visit**: language comes from the browser (navigator). If the browser language is not supported, the app falls back to English.
- **After the user selects a language**: the choice is saved in `localStorage` under the key `i18nextLng` and reused on later visits.

## How translations are handled

### Text

Translated strings come from JSON files under `public/locales/web/{lng}/`. Use the type-safe hook from `@/i18n`:

```tsx
import { useT } from "@/i18n";

function MyComponent() {
  const t = useT();
  return (
    <>
      <h1>{t("home.intro.title")}</h1>
      <p>{t("home.intro.description", { templates: "Templates", learning: "Learning" })}</p>
    </>
  );
}
```

- Keys use dot-notation: `namespace.section.key` (e.g. `home.intro.title`). The first segment is the namespace (file).
- For strings that contain placeholders (e.g. `"Head over to {{templates}} or the {{learning}} center."`), pass an object as the second argument: `t("home.intro.description", { templates: "…", learning: "…" })`.
- Missing keys fall back to English; in development, a warning is logged.

See [Translation (i18n)](i18n.md) for the full key layout and adding languages.

### Dates

Use the date formatter from `@/i18n/formatters`, which formats with the **current i18n language** via `Intl.DateTimeFormat`:

```tsx
import { formatDate } from "@/i18n/formatters";

formatDate(new Date());                    // e.g. "3/11/2025" (en) or "11.03.2025" (de)
formatDate(date, { dateStyle: "long" });   // e.g. "March 11, 2025" (en)
```

So dates automatically follow the selected language and locale conventions (order, separators, month names).

### Currency

Use the currency formatter so amounts follow the selected language and locale:

```tsx
import { formatCurrency } from "@/i18n/formatters";

formatCurrency(99.99, "USD");   // e.g. "$99.99" (en) or "99,99 $" (de)
formatCurrency(1500, "EUR");    // e.g. "€1,500.00" (en) or "1.500,00 €" (de)
```

Implementation uses `Intl.NumberFormat` with `style: "currency"` and the current `i18n.language`, so symbol position and decimal/thousand separators match the locale.

### Numbers (no currency)

For plain numbers (no currency symbol), use `formatNumber`:

```tsx
import { formatNumber } from "@/i18n/formatters";

formatNumber(1234.56);   // e.g. "1,234.56" (en) or "1.234,56" (de)
```

Again, the active language drives separators and formatting.

---

Summary:

| Kind      | How it’s handled |
|----------|-------------------|
| Text     | `useT()` from `@/i18n`; keys in locale JSON. |
| Dates    | `formatDate()` from `@/i18n/formatters`; uses `Intl.DateTimeFormat(i18n.language)`. |
| Currency | `formatCurrency(value, currency)` from `@/i18n/formatters`; uses `Intl.NumberFormat` with `style: "currency"`. |
| Numbers  | `formatNumber()` from `@/i18n/formatters`; uses `Intl.NumberFormat(i18n.language)`. |

## RTL (right-to-left)

Languages that use right-to-left script (e.g. Arabic) are listed in [src/i18n/config.ts](../src/i18n/config.ts) as `rtlLngs` (currently `["ar"]`). The app does the following:

1. **On init and when the language changes**, [I18nProvider](../src/components/I18nProvider.tsx) runs a callback that:
   - Sets `document.documentElement.lang` to the current language (e.g. `ar`).
   - Sets `document.documentElement.dir` to `"rtl"` when the language is in `rtlLngs`, otherwise `"ltr"`.

2. **Layout and styling** then follow the document direction: with `dir="rtl"`, the browser flips horizontal layout (e.g. flex/grid, margins, text alignment). You can also use CSS logical properties (`margin-inline-start`, `text-align: start`) or `[dir="rtl"]` selectors if you need RTL-specific styles.

```
  User selects Arabic (or first load with ar in navigator)
       |
       v
  i18n.language = "ar" --> isRtl("ar") === true
       |
       v
  document.documentElement.lang = "ar"
  document.documentElement.dir = "rtl"
       |
       v
  Page layout and text flow right-to-left; RTL-aware CSS applies
```

To add another RTL language, add its code to the `rtlLngs` array in [src/i18n/config.ts](../src/i18n/config.ts).
