This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

- **[Getting started](docs/getting-started.md)** – Start the project, select languages, and how the app handles translated text, dates, currency, and RTL.
- **[Translation (i18n)](docs/i18n.md)** – How the app handles translations with i18next: config, namespaces, `useT()`, formatters, and adding languages.
- **[i18n naming rules](docs/i18n-naming-rules.md)** – Key convention (`screen.section.key`), character/casing rules, and examples so JSON works on web, iOS, and Android.
- **[Translate script (en → other languages)](docs/translate-locales.md)** – Script that translates English locale folders to de, fr, ja, ar via the Open Router API.
- **[iOS and Android: using JSON for i18n](docs/mobile-i18n.md)** – How mobile apps can use the same locale JSON (bundle or fetch) and key structure.
- **[Translations API](docs/translations-api.md)** – The endpoint that returns translation JSON by language and platform (query params, response shape, caching).

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
