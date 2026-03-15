# Buffer Localization

A Next.js app that demonstrates a full localization (i18n) setup: multiple languages on the web, a shared translations API for mobile clients, and a script to generate locale files from English via an LLM.

## What this project does

- **Web app** – React/Next.js UI with a language switcher. Content is translated into **5 languages** (English, Deutsch, Français, 日本語, العربية), with RTL layout for Arabic.
- **Translations API** – HTTP endpoint that returns translation JSON by language and platform (`web`, `ios`, `android`) so mobile apps can load strings at runtime or bundle the same JSON.
- **Translate script** – CLI that reads English locale JSON and produces de, fr, ja, ar using the Open Router API, keeping keys and placeholders intact.

Locale files live under `public/locales/{platform}/{lng}/` as namespaced JSON (e.g. `common`, `home`, `journey`). The web app uses i18next; mobile can use the same structure or fetch from the API.

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language dropdown in the nav to switch languages. First-time visitors see a short onboarding that highlights the translation feature.

## Documentation

| Doc | Description |
|-----|-------------|
| [Getting started](docs/getting-started.md) | Run the app, change language, and how text, dates, currency, and RTL work. |
| [Translation (i18n)](docs/i18n.md) | i18n config, namespaces, `useT()`, formatters, and adding languages. |
| [i18n naming rules](docs/i18n-naming-rules.md) | Key convention (`screen.section.key`), rules, and examples for web and mobile. |
| [Translate script](docs/translate-locales.md) | Translate English locale files to de, fr, ja, ar via Open Router. |
| [Mobile i18n](docs/mobile-i18n.md) | Using the same locale JSON on iOS and Android (bundle or fetch). |
| [Translations API](docs/translations-api.md) | API reference: endpoint, query params, response shape, caching. |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js dev server. |
| `pnpm build` | Production build. |
| `pnpm start` | Run the production server. |
| `pnpm translate` | Run the locale translation script (see [Translate script](docs/translate-locales.md); requires `.env` with Open Router key). |

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
