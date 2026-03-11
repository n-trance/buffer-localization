# Translations API

The app exposes an HTTP endpoint that returns translation JSON for a given language and platform. Mobile apps (iOS, Android) or other clients can use it to load strings at runtime instead of bundling JSON.

## Endpoint

```
GET /api/v1/translations/{lng}
```

- **`lng`** (path) – Locale code. Must be one of: `en`, `de`, `fr`, `ja`, `ar`.

## Query parameters

| Parameter | Required | Default | Description |
|-----------|----------|--------|-------------|
| `platform` | No | `web` | Platform whose locale files to use: `web`, `ios`, or `android`. |
| `ns` | No | all namespaces | Comma-separated list of namespaces to return. Valid values: `common`, `home`, `layout`, `journey`, `job`. |

The server reads from `public/locales/{platform}/{lng}/{namespace}.json`. If a namespace file is missing or invalid, the request returns 404.

## Response (200)

JSON body:

```json
{
  "lng": "de",
  "platform": "android",
  "namespaces": {
    "common": {
      "language": "Sprache",
      "languages": { "en": "Englisch", "de": "Deutsch", "fr": "Französisch", "ja": "Japanisch", "ar": "Arabisch" }
    },
    "home": { "intro": { "title": "...", "description": "..." }, ... },
    "layout": { ... },
    "journey": { ... },
    "job": { ... }
  }
}
```

- **lng** – The requested locale.
- **platform** – The requested platform (echoes the query param).
- **namespaces** – One object per requested namespace; each object matches the structure of the corresponding JSON file (nested keys and string values, with optional `{{...}}` placeholders in values).

## Caching

- Response includes an **ETag** header (hash of the response body). Send it in the next request as `If-None-Match: <etag>` to get **304 Not Modified** when nothing has changed.
- **Cache-Control**: `public, max-age=3600, s-maxage=3600` (1 hour). Clients and CDNs may cache the response for that period.

## Error responses

| Status | When | Body |
|--------|------|------|
| 400 | Unsupported or missing `lng` | `{ "error": "Unsupported locale", "supported": ["en", "de", "fr", "ja", "ar"] }` |
| 400 | Invalid `platform` | `{ "error": "Invalid platform", "allowed": ["web", "ios", "android"] }` |
| 400 | Invalid namespace in `ns` | `{ "error": "Invalid namespace(s)", "invalid": [...], "valid": ["common", "home", "layout", "journey", "job"] }` |
| 404 | Missing or invalid locale file for the requested platform/lng/namespace | `{ "error": "Missing or invalid locale file: android/de/common.json" }` (or similar message) |

## Local usage (curl)

Run the dev server (`pnpm dev`), then from another terminal:

```bash
# All namespaces, German, web (default)
curl -s "http://localhost:3000/api/v1/translations/de" | jq .

# Android platform, French
curl -s "http://localhost:3000/api/v1/translations/fr?platform=android" | jq .

# iOS, only common and home
curl -s "http://localhost:3000/api/v1/translations/ja?platform=ios&ns=common,home" | jq .

# With ETag: save response and ETag, then conditional request
curl -s -D - "http://localhost:3000/api/v1/translations/ar?platform=android" -o /tmp/translations.json
# Copy the ETag from the headers, then:
curl -s -w "%{http_code}" -H 'If-None-Match: "YOUR_ETAG_HERE"' "http://localhost:3000/api/v1/translations/ar?platform=android" -o /dev/null
# 304 when unchanged
```

Drop `| jq .` if you don’t have [jq](https://jqlang.github.io/jq/); the response is still valid JSON.

## Examples (HTTP)

**All namespaces for German on Android:**

```http
GET /api/v1/translations/de?platform=android
```

**Only common and home for French on iOS:**

```http
GET /api/v1/translations/fr?platform=ios&ns=common,home
```

**Web (default platform), all namespaces:**

```http
GET /api/v1/translations/ja
```

**Using ETag to avoid re-downloading:**

```http
GET /api/v1/translations/ar?platform=android
--> 200 OK, ETag: "a1b2c3..."

GET /api/v1/translations/ar?platform=android
If-None-Match: "a1b2c3..."
--> 304 Not Modified
```

## Implementation

The handler is implemented in [src/app/api/v1/translations/[lng]/route.ts](../src/app/api/v1/translations/[lng]/route.ts). It uses the same [supportedLngs](../src/i18n/config.ts) and namespace list as the web i18n config, and reads files from `public/locales/{platform}/{lng}/{ns}.json`.
