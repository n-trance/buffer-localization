import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { namespaces, supportedLngs } from "@/i18n/config";

const LOCALES_DIR = join(process.cwd(), "public", "locales");
const CACHE_MAX_AGE = 3600; // 1 hour

const SUPPORTED_PLATFORMS = ["web", "ios", "android"] as const;
type Platform = (typeof SUPPORTED_PLATFORMS)[number];

type NamespaceMap = Record<string, Record<string, unknown>>;

async function readJsonIfExists(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function loadLocaleNamespaces(
  lng: string,
  requestedNs: string[] | null,
  platform: Platform
): Promise<NamespaceMap> {
  const toLoad = requestedNs ?? [...namespaces];
  const result: NamespaceMap = {};
  const localeRoot = join(LOCALES_DIR, platform, lng);

  for (const ns of toLoad) {
    if (!namespaces.includes(ns as (typeof namespaces)[number])) {
      continue;
    }

    const fileName = `${ns}.json`;
    const data = await readJsonIfExists(join(localeRoot, fileName));

    if (data === null) {
      throw new Error(
        `Missing or invalid locale file: ${platform}/${lng}/${ns}.json`
      );
    }

    result[ns] = data;
  }

  return result;
}

function computeETag(body: string): string {
  const hash = createHash("sha256").update(body, "utf-8").digest("hex");
  return `"${hash}"`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lng: string }> }
) {
  const { lng } = await context.params;

  if (!supportedLngs.includes(lng as (typeof supportedLngs)[number])) {
    return NextResponse.json(
      { error: "Unsupported locale", supported: [...supportedLngs] },
      { status: 400 }
    );
  }

  const platformParam = request.nextUrl.searchParams.get("platform") ?? "web";
  if (!SUPPORTED_PLATFORMS.includes(platformParam as Platform)) {
    return NextResponse.json(
      { error: "Invalid platform", allowed: [...SUPPORTED_PLATFORMS] },
      { status: 400 }
    );
  }
  const platform = platformParam as Platform;

  const nsParam = request.nextUrl.searchParams.get("ns");
  const requestedNs = nsParam
    ? nsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : null;
  if (requestedNs !== null) {
    const invalid = requestedNs.filter(
      (n) => !namespaces.includes(n as (typeof namespaces)[number])
    );
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: "Invalid namespace(s)", invalid, valid: [...namespaces] },
        { status: 400 }
      );
    }
  }

  let namespacesData: NamespaceMap;
  try {
    namespacesData = await loadLocaleNamespaces(lng, requestedNs, platform);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Locale not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  const body = {
    lng,
    platform,
    namespaces: namespacesData,
  };
  const bodyString = JSON.stringify(body);
  const etag = computeETag(bodyString);
  const ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch != null && ifNoneMatch.trim() === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
      },
    });
  }

  return NextResponse.json(body, {
    status: 200,
    headers: {
      ETag: etag,
      "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
      "Content-Type": "application/json",
    },
  });
}
