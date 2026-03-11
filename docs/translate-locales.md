# Translate script: en folders to other languages

The script reads English locale JSON from `public/locales/{platform}/en/`, calls the Open Router API to translate string values (keeping keys and `{{...}}` placeholders unchanged), and writes files to `public/locales/{platform}/{locale}/` for target languages `de`, `fr`, `ja`, `ar`. Existing target files are skipped unless you pass `--overwrite`.

## Flow

```
  public/locales/web/en/*.json
            |
            v
  +------------------+
  | Discover platforms|   (web/en, android/en, ios/en)
  | and namespace files|
  +------------------+
            |
            v
  For each (source file, target locale):
            |
            v
  +------------------+     +------------------+     +------------------+
  | Read EN JSON     | --> | Open Router API  | --> | Parse response    |
  +------------------+     +------------------+     +------------------+
            |                        |                        |
            v                        v                        v
  Validate same keys         Translate values         Write to
  and placeholders            (keep {{x}})             platform/{locale}/
```

## Discovery

The script only looks for `{platform}/en/` directories (no versioned paths). For each such directory it generates translations into the same platform for each target locale:

```
public/locales/
├── web/
│   ├── en/          <-- source (common.json, home.json, ...)
│   ├── de/          <-- output
│   ├── fr/
│   ├── ja/
│   └── ar/
├── android/
│   ├── en/
│   ├── de/
│   └── ...
└── ios/
    ├── en/
    └── ...
```

## Prerequisites

- **OPENROUTER_API_KEY** – Required for translation. Get a key at [openrouter.ai](https://openrouter.ai).
- **OPENROUTER_MODEL** – Optional. Default is `google/gemini-flash-1.5` (or the value in the script).

When you run the script, it loads env from `.env` or [.env.example](../.env.example) in the project root, so you can put your key in `.env` and run without exporting.

## Usage

```bash
pnpm translate [options]
```

| Option | Short | Description |
|--------|-------|-------------|
| `--platform` | `-p` | Restrict to one platform: `web`, `android`, `ios` |
| `--locale` | `-l` | Restrict to one target locale: `de`, `fr`, `ja`, `ar` |
| `--namespace` | | Restrict to one namespace (e.g. `common`, `home`) |
| `--dry-run` | | List files that would be translated; no API calls or writes |
| `--overwrite` | | Overwrite existing target files (default: skip existing) |
| `--help` | `-h` | Show help |

Defaults: all platforms, all target locales, skip existing files.

## Examples

**See what would be translated (no API, no writes):**

```bash
pnpm translate --dry-run
```

**Translate only the web platform into German:**

```bash
pnpm translate -p web -l de
```

**Translate only the `common` namespace for all platforms and locales:**

```bash
pnpm translate --namespace common
```

**Regenerate all existing translations (overwrite):**

```bash
pnpm translate --overwrite
```

**Using a key from the environment instead of .env file:**

```bash
OPENROUTER_API_KEY=sk-xxx pnpm translate -p web
```
