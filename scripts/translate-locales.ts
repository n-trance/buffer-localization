#!/usr/bin/env npx tsx
/**
 * Translate English locale JSON files to other languages using Open Router API.
 *
 * Usage:
 *   pnpm translate [options]
 *   OPENROUTER_API_KEY=xxx pnpm translate --dry-run
 *
 * Options:
 *   --platform, -p <name>   Restrict to one platform (web, android, ios)
 *   --locale, -l <code>     Restrict to one target locale (de, fr, ja, ar)
 *   --namespace <name>      Restrict to one namespace (e.g. common, home)
 *   --dry-run               List files that would be translated, no API or writes
 *   --overwrite             Overwrite existing target files (default: skip)
 *   --help, -h              Show this help
 *
 * Environment (loaded from .env or .env.example when running this script):
 *   OPENROUTER_API_KEY      Required for translation (get from openrouter.ai)
 *   OPENROUTER_MODEL        Optional; default: google/gemini-2.5-flash-lite
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";

const ENV_EXAMPLE = ".env.example";
const ENV_FILE = ".env";

async function loadEnvFile(): Promise<void> {
  const root = process.cwd();
  // Load .env.example first (defaults), then .env (overrides)
  const toTry = [path.join(root, ENV_EXAMPLE), path.join(root, ENV_FILE)];
  for (const filePath of toTry) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
          value = value.slice(1, -1);
        if (key && process.env[key] === undefined) process.env[key] = value;
      }
    } catch {
      // file missing or unreadable, skip
    }
  }
}

const LOCALES_DIR = path.join(process.cwd(), "public", "locales");
const DEFAULT_TARGET_LOCALES = ["de", "fr", "ja", "ar"];
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";

type CliOptions = {
  platform: string | null;
  locale: string | null;
  namespace: string | null;
  dryRun: boolean;
  overwrite: boolean;
};

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    platform: null,
    locale: null,
    namespace: null,
    dryRun: false,
    overwrite: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`
Translate English locale JSON files to other languages using Open Router.

Usage: pnpm translate [options]

Options:
  --platform, -p <name>   Restrict to one platform (web, android, ios)
  --locale, -l <code>     Restrict to one target locale (de, fr, ja, ar)
  --namespace <name>      Restrict to one namespace (e.g. common, home)
  --dry-run               List files that would be translated, no API or writes
  --overwrite             Overwrite existing target files (default: skip)
  --help, -h              Show this help

Environment (loaded from .env or .env.example):
  OPENROUTER_API_KEY      Required for translation
  OPENROUTER_MODEL        Optional; default: google/gemini-flash-1.5
`);
      process.exit(0);
    }
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--overwrite") options.overwrite = true;
    else if ((arg === "--platform" || arg === "-p") && args[i + 1])
      options.platform = args[++i];
    else if ((arg === "--locale" || arg === "-l") && args[i + 1])
      options.locale = args[++i];
    else if (arg === "--namespace" && args[i + 1]) options.namespace = args[++i];
  }
  return options;
}

async function discoverEnSourceDirs(): Promise<string[]> {
  const dirs: string[] = [];
  const entries = await fs.readdir(LOCALES_DIR, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const platformPath = path.join(LOCALES_DIR, e.name);
    const enPath = path.join(platformPath, "en");
    try {
      const stat = await fs.stat(enPath);
      if (stat.isDirectory()) dirs.push(enPath);
    } catch {
      // no en dir
    }
  }
  return dirs.sort();
}

async function getNamespaceFiles(enDir: string): Promise<string[]> {
  const names = await fs.readdir(enDir);
  return names
    .filter((n) => n.endsWith(".json"))
    .map((n) => path.join(enDir, n))
    .sort();
}

function getTargetPath(enFilePath: string, targetLocale: string): string {
  const dir = path.dirname(enFilePath);
  const base = path.basename(enFilePath);
  const parentDir = path.dirname(dir);
  return path.join(parentDir, targetLocale, base);
}

function sameTopLevelKeys(a: object, b: object): boolean {
  const keysA = Object.keys(a).sort().join(",");
  const keysB = Object.keys(b).sort().join(",");
  return keysA === keysB;
}

function buildSystemPrompt(targetLocale: string): string {
  const localeNames: Record<string, string> = {
    de: "German",
    fr: "French",
    ja: "Japanese",
    ar: "Arabic",
  };
  const lang = localeNames[targetLocale] ?? targetLocale;
  return `You are a professional translator. Translate the following JSON from English to ${lang}.

Rules:
- Translate ONLY the string values. Do not change any keys.
- Keep the exact same JSON structure (same keys, same nesting).
- Do not translate or modify any substring that looks like \{{...}}. Keep every \{{...}} placeholder exactly as in the source.
- Return ONLY valid JSON, no markdown code fences or extra text.`;
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string
): Promise<string> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/buffer-localization",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status === 429) {
          const backoff = Math.min(2000 * attempt, 10000);
          await new Promise((r) => setTimeout(r, backoff));
          lastError = new Error(`Open Router rate limit: ${res.status} ${text}`);
          continue;
        }
        throw new Error(`Open Router error ${res.status}: ${text}`);
      }
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        error?: { message?: string };
      };
      if (data.error?.message) throw new Error(data.error.message);
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== "string") throw new Error("Empty or invalid response");
      return content;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxRetries) {
        const backoff = Math.min(1000 * attempt, 5000);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  }
  throw lastError ?? new Error("Unknown error");
}

async function main(): Promise<void> {
  await loadEnvFile();
  const options = parseArgs();
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  if (!options.dryRun && !apiKey) {
    console.error("Error: OPENROUTER_API_KEY is required. Set it in .env or export it.");
    process.exit(1);
  }

  const enDirs = await discoverEnSourceDirs();
  if (enDirs.length === 0) {
    console.error("No English locale directories found under public/locales");
    process.exit(1);
  }

  let platformsFilter: Set<string> | null = null;
  if (options.platform) {
    platformsFilter = new Set([options.platform]);
  }

  const targetLocales = options.locale
    ? [options.locale]
    : DEFAULT_TARGET_LOCALES;

  const work: { enPath: string; locale: string; namespacePath: string }[] = [];

  for (const enDir of enDirs) {
    const rel = path.relative(LOCALES_DIR, enDir);
    const platform = rel.split(path.sep)[0];
    if (platformsFilter && !platformsFilter.has(platform)) continue;

    const files = await getNamespaceFiles(enDir);
    for (const namespacePath of files) {
      if (options.namespace && path.basename(namespacePath, ".json") !== options.namespace)
        continue;
      for (const locale of targetLocales) {
        const targetPath = getTargetPath(namespacePath, locale);
        if (!options.overwrite) {
          try {
            await fs.access(targetPath);
            continue; // skip existing
          } catch {
            // file missing, include in work
          }
        }
        work.push({ enPath: namespacePath, locale, namespacePath });
      }
    }
  }

  if (options.dryRun) {
    console.log("Dry run: would translate the following:");
    for (const w of work) {
      const outPath = getTargetPath(w.enPath, w.locale);
      console.log(`  ${path.relative(process.cwd(), w.enPath)} -> ${path.relative(process.cwd(), outPath)}`);
    }
    console.log(`Total: ${work.length} file(s)`);
    return;
  }

  let done = 0;
  let failed = 0;
  for (const w of work) {
    const outPath = getTargetPath(w.enPath, w.locale);
    try {
      const raw = await fs.readFile(w.enPath, "utf-8");
      const source = JSON.parse(raw) as object;
      const systemPrompt = buildSystemPrompt(w.locale);
      const content = await callOpenRouter(
        apiKey!,
        model,
        systemPrompt,
        JSON.stringify(source, null, 2)
      );
      let translated: object;
      try {
        translated = JSON.parse(content) as object;
      } catch {
        console.error(`Invalid JSON from API for ${w.enPath} -> ${w.locale}`);
        failed++;
        continue;
      }
      if (!sameTopLevelKeys(source, translated)) {
        console.error(`Structure mismatch for ${w.enPath} -> ${w.locale}`);
        failed++;
        continue;
      }
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, JSON.stringify(translated, null, 2) + "\n", "utf-8");
      done++;
      console.log(`OK ${path.relative(process.cwd(), outPath)}`);
    } catch (e) {
      console.error(`Error ${w.enPath} -> ${w.locale}:`, e instanceof Error ? e.message : e);
      failed++;
    }
  }

  console.log(`\nDone: ${done} translated, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
