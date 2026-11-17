/**
 * Pure helpers for composing and parsing San Pablo City addresses.
 * Extracted from AddressPicker so they can be unit-tested without rendering.
 */

export const CITY_CODE = "0403424000";
export const CITY_LABEL = "City of San Pablo";
export const PROVINCE_LABEL = "Laguna";
export const REGION_LABEL = "CALABARZON";

export type Barangay = { code: string; name: string };

const FIXED_TAIL =
  /^(city of san pablo|san pablo city|san pablo|laguna|calabarzon|region iv-a( \\(calabarzon\\))?)$/i;

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatBarangayName(name: string) {
  const trimmed = name.trim();
  return /^brgy\.?\b|^barangay\b/i.test(trimmed)
    ? trimmed
    : `Brgy. ${trimmed}`;
}

export function buildAddress(street: string, barangay: Barangay | null) {
  const parts: string[] = [];
  const cleanStreet = street.trim().replace(/\s{2,}/g, " ");
  if (cleanStreet) parts.push(cleanStreet);
  if (barangay) parts.push(formatBarangayName(barangay.name));
  parts.push(CITY_LABEL, PROVINCE_LABEL, REGION_LABEL);
  return parts.join(", ");
}

/** Best-effort prefill from a previously stored address string. */
export function parseInitialAddress(
  initial: string,
  barangays: Barangay[]
): { street: string; code: string } {
  if (!initial.trim()) return { street: "", code: "" };

  let code = "";
  let remainder = initial;

  // Match the longest official name first so e.g. "San Francisco" beats
  // a shorter shared substring.
  const sorted = [...barangays].sort((a, b) => b.name.length - a.name.length);
  for (const barangay of sorted) {
    const aliases = [
      barangay.name,
      barangay.name.replace(/^Barangay\s+/i, ""),
      barangay.name.replace(/^Brgy\.?\s*/i, ""),
    ]
      .map((alias) => alias.trim())
      .filter(Boolean);

    const match = aliases.find((alias) =>
      remainder.toLowerCase().includes(alias.toLowerCase())
    );

    if (match) {
      code = barangay.code;
      remainder = remainder.replace(
        new RegExp(escapeRegExp(match), "gi"),
        " "
      );
      break;
    }
  }

  const street = remainder
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !FIXED_TAIL.test(part))
    .map((part) => part.replace(/^brgy\.?\s*/i, "").trim())
    .filter(Boolean)
    .join(", ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { street, code };
}

export function dedupeAndSort(list: Barangay[]): Barangay[] {
  const seen = new Set<string>();
  return list
    .filter((item) => item && item.code && item.name)
    .filter((item) => {
      if (seen.has(item.code)) return false;
      seen.add(item.code);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}
