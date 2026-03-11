# iOS and Android: using JSON for i18n

The same translation JSON used by the web app is available for iOS and Android. You can **bundle** the files in your native app or **fetch** them at runtime from the [translations API](translations-api.md).

## Where the JSON lives

Locale files are under `public/locales/` by platform and language:

```
public/locales/
├── web/
│   └── {lng}/          (common.json, home.json, layout.json, journey.json, job.json)
├── android/
│   └── {lng}/          (same namespaces)
└── ios/
    └── {lng}/          (same namespaces)
```

Supported languages: `en`, `de`, `fr`, `ja`, `ar`. Namespaces: `common`, `home`, `layout`, `journey`, `job`.

The **structure is identical** across web, iOS, and Android: each namespace is a single JSON file with nested keys. Platforms can override specific strings (e.g. `common.json` on Android might use "Language (Android)" for the language label) while keeping the same keys.

## JSON shape and keys

Each namespace file is a nested object. Keys use dot-notation when resolved in code:

```json
{
  "language": "Language",
  "languages": {
    "en": "English",
    "de": "Deutsch",
    "fr": "Français"
  }
}
```

```json
{
  "hero": {
    "title": "Join our journey",
    "subtitle": "Working with us is more than just a job.",
    "cta": "See our open roles"
  }
}
```

- **Top-level keys** are the namespace (file name without `.json`).
- **Inside each file**, keys can be nested. To reference a value you use a path: `common.language`, `journey.hero.title`, `job.details.compensationLabel`.
- **Interpolation**: some values contain `{{name}}` placeholders. Replace them at runtime with the appropriate variable (e.g. `"Hello {{name}}"` → `"Hello World"`).

## Two ways to use the JSON

### 1. Bundle JSON in the app

- Copy the contents of `public/locales/android/{lng}/` (or `ios/{lng}/`) into your app’s assets (e.g. Android `res/raw` or asset folder, iOS asset catalog or bundle).
- At runtime, read the JSON for the user’s language and namespace(s), parse into a map/dictionary.
- Resolve keys by path (e.g. `common.language` → split by `.`, walk the tree). Apply interpolation for `{{...}}` when rendering.

This gives offline support and no network dependency for strings.

### 2. Fetch from the translations API

- Call `GET /api/v1/translations/{lng}?platform=android` (or `platform=ios`) to get all namespaces for that language in one response.
- Optionally request only some namespaces: `?platform=android&ns=common,home`.
- Cache the response (e.g. in memory or local storage) and use it like bundled JSON: resolve keys by path and handle `{{...}}`.

This keeps mobile in sync with the repo without shipping new app builds when copy changes. See [Translations API](translations-api.md) for the full contract.

## Using an i18n library

You can use an i18n library that supports **nested JSON namespaces**, **dot-notation keys** (e.g. `common.language`, `journey.hero.title`), and **`{{variable}}` interpolation**. The web app uses [i18next](https://www.i18next.com/); the same JSON works with libraries that accept that format.

**Android** – **[i18next-android](https://github.com/i18next/i18next-android)** is the i18next port for Android. It loads the same JSON structure (namespaces, nested keys, interpolation). You can:

- Point it at bundled JSON in assets (one file per namespace under a locale folder), or
- Fetch from the [translations API](translations-api.md) (`GET /api/v1/translations/{lng}?platform=android`), then feed the `namespaces` object into the library so it can resolve keys and interpolate.

That way you get `t("common.language")`, `t("journey.hero.title")`, and `t("home.intro.description", mapOf("templates" to "Templates", "learning" to "Learning"))` without writing your own parser.

**iOS** – Native iOS usually uses String Catalogs (`.xcstrings`) or `.strings` files. For **JSON-based** translations that match this repo, use a library that loads from JSON (e.g. [JSONlize](https://github.com/GetOhsome/JSONlize)); the API response shape and key structure in this doc are what it needs to support.

## Code examples (with library)

### Android (i18next-android)

**[i18next-android](https://github.com/i18next/i18next-android)** uses the same resources shape as i18next: per-language, per-namespace, nested keys. Initialize with the API response or with bundled JSON, then use `t()` for keys and interpolation.

**Init from translations API response:**

```kotlin
// After: val response = httpClient.get("/api/v1/translations/de?platform=android")
// response: { "lng": "de", "platform": "android", "namespaces": { "common": {...}, "home": {...}, ... } }

val namespaces = response.namespaces  // Map<String, Any> or your JSON type
val resources = mapOf(
    response.lng to namespaces
)
I18n.init {
    resources(resources)
    lng(response.lng)
    fallbackLng("en")
}

// In UI or ViewModel:
// label.text = I18n.t("language", mapOf("ns" to "common"))           // "Sprache"
// title.text = I18n.t("hero.title", mapOf("ns" to "journey"))         // "Join our journey"
// desc.text = I18n.t("intro.description", mapOf(
//     "ns" to "home",
//     "templates" to "Templates",
//     "learning" to "Learning"
// ))
```

Keys are the path inside the namespace (e.g. `language` for `common.language`, `hero.title` for `journey.hero.title`). Pass the namespace with `ns` in the options map. Interpolation uses the same `{{key}}` names as the JSON; pass them in the options map.

**Init from bundled assets** (e.g. `assets/locales/de/common.json`):

Configure the backend to load from your assets path (e.g. `locales/{{lng}}/{{ns}}.json`), then call `I18n.init { lng("de"); fallbackLng("en"); /* backend loadPath */ }` and use `t()` the same way. See the i18next-android docs for asset backend configuration.

### iOS (JSONlize or similar)

**[JSONlize](https://github.com/GetOhsome/JSONlize)** loads translations from JSON files. Bundle the `ios/{lng}/*.json` files in your app (e.g. in the app bundle under `locales/{lng}/`) or load the [translations API](translations-api.md) response and register the namespaces.

**Using the translations API:**

```swift
// Fetch and decode: GET /api/v1/translations/de?platform=ios
// struct TranslationsResponse { let lng: String; let namespaces: [String: [String: Any]] }

// Load namespaces from the API response into your i18n library (e.g. JSONlize).
// Pattern: register each namespace for the language, then set current language.
for (ns, dict) in response.namespaces {
    l10n.load(namespace: ns, content: dict, lang: response.lng)  // API depends on library
}
l10n.currentLanguage = response.lng

// In SwiftUI or UIKit:
// Text(l10n.t("common.language"))
// Text(l10n.t("journey.hero.title"))
// Text(l10n.t("home.intro.description", variables: ["templates": "Templates", "learning": "Learning"]))
```

Exact method names depend on the library (e.g. `t(_:arguments:)`, `string(forKey:in:variables:)`, or nested key paths). Feed the API `namespaces` (or bundled JSON) into the library, then use dot-notation keys and pass interpolation variables for `{{...}}`.

**Bundle JSON** – Add `locales/{lng}/{ns}.json` to the app target and point the library at that path. See the library’s docs for bundle/path configuration.

## Suggested usage on each platform

**Android** – Embed `android/{lng}/*.json` in assets or fetch with `platform=android`. Use the same key paths as web. RTL: use layout direction APIs for `ar`.

**iOS** – Embed `ios/{lng}/*.json` in the bundle or fetch with `platform=ios`. Set `userInterfaceLayoutDirection` (or semantic attributes) for RTL when language is `ar`.

## Summary

| Aspect | Detail |
|--------|--------|
| Location | `public/locales/android/{lng}/*.json` and `public/locales/ios/{lng}/*.json` |
| Namespaces | `common`, `home`, `layout`, `journey`, `job` |
| Key format | Nested JSON; paths like `namespace.section.key` |
| Interpolation | Replace `{{name}}` (and similar) at render time |
| RTL | Use `ar` and your platform’s RTL/layout direction APIs |
| Source of truth | Same keys as web; [translate script](translate-locales.md) can generate android/ios from `en` |
