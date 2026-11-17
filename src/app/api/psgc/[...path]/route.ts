import { NextResponse } from "next/server";

/**
 * Cached, server-side proxy for the public PSGC Cloud v2 API.
 *
 * Only geographic reference endpoints are exposed (read-only GET), and paths
 * are validated against an allow-list so this route cannot be used as a
 * generic open proxy. Responses are cached for a day because PSGC data
 * changes rarely and their terms discourage high-frequency scraping.
 *
 *   GET /api/psgc/regions
 *   GET /api/psgc/provinces
 *   GET /api/psgc/cities-municipalities
 *   GET /api/psgc/cities-municipalities/{code}/barangays
 */

const PSGC_BASE = "https://psgc.cloud/api/v2";
const REVALIDATE_SECONDS = 60 * 60 * 24;

// Simple collections (exact match).
const COLLECTIONS = new Set(["regions", "provinces", "cities-municipalities"]);

// Nested collection: cities-municipalities/{10-digit-code}/barangays
const BARANGAYS_PATTERN = /^cities-municipalities\/(\d{10})\/barangays$/;

function isAllowed(path: string): boolean {
  return COLLECTIONS.has(path) || BARANGAYS_PATTERN.test(path);
}

/** PSGC returns some names with trailing/extra whitespace. */
function normalize(item: unknown): unknown {
  if (item === null || typeof item !== "object") return item;
  const record = item as Record<string, unknown>;
  return {
    ...record,
    name: typeof record.name === "string" ? record.name.trim() : record.name,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const segments = Array.isArray(params?.path)
    ? params.path.map((segment) => decodeURIComponent(segment))
    : [];
  const path = segments.join("/");

  if (!isAllowed(path)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const upstream = await fetch(`${PSGC_BASE}/${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `PSGC responded with ${upstream.status}` },
        { status: 502 }
      );
    }

    const body: unknown = await upstream.json();
    const data = (body as { data?: unknown })?.data;
    const list = Array.isArray(data) ? data.map(normalize) : [];

    return NextResponse.json({ data: list });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the PSGC service." },
      { status: 502 }
    );
  }
}
