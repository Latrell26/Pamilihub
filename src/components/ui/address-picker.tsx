"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Loader2, MapPin, TriangleAlert } from "lucide-react";
import {
  Barangay,
  buildAddress,
  CITY_CODE,
  CITY_LABEL,
  dedupeAndSort,
  PROVINCE_LABEL,
  REGION_LABEL,
  formatBarangayName,
  parseInitialAddress,
} from "@/lib/address/format";

/**
 * San Pablo City address picker backed by the PSGC Cloud API (proxied through
 * /api/psgc). The city/province/region is fixed; the customer picks a street
 * and one of San Pablo City's 80 barangays, and the component emits a single
 * formatted address string for the existing address column.
 */

export type AddressPickerProps = {
  /** Form value (kept in the parent so it can be submitted as usual). */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
};

export function AddressPicker({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: AddressPickerProps) {
  const reactId = useId();
  const streetId = `${reactId}-street`;
  const brgyId = `${reactId}-barangay`;

  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [manual, setManual] = useState(false);

  const [street, setStreet] = useState("");
  const [brgyCode, setBrgyCode] = useState("");

  const dirtyRef = useRef(false);
  const lastEmittedRef = useRef<string | null>(null);
  const parsedRef = useRef(false);

  // Load San Pablo City barangays once.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(
          `/api/psgc/cities-municipalities/${CITY_CODE}/barangays`
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const body: unknown = await res.json();
        const data = (body as { data?: unknown })?.data;
        if (!Array.isArray(data)) throw new Error("Unexpected response");

        if (!active) return;
        setBarangays(
          dedupeAndSort(
            data.filter(
              (item): item is Barangay =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as Barangay).code === "string" &&
                typeof (item as Barangay).name === "string"
            )
          )
        );
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load barangays."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  // Prefill street/barangay when the list arrives, and re-prefill if the
  // parent supplies a different stored value (e.g. profile autofill).
  useEffect(() => {
    if (barangays.length === 0) return;
    // Never override a value the user is actively editing; prefill only
    // applies to stored addresses before the first interaction.
    if (dirtyRef.current) return;

    const currentBrgy = barangays.find((b) => b.code === brgyCode) ?? null;
    const composed = buildAddress(street, currentBrgy);
    if (value === composed || value === lastEmittedRef.current) return;

    if (!parsedRef.current || lastEmittedRef.current === null) {
      const parsed = parseInitialAddress(value, barangays);
      setStreet(parsed.street);
      setBrgyCode(parsed.code);
    }
    parsedRef.current = true;
  }, [barangays, value, street, brgyCode]);

  // Emit the formatted address, but only after the user interacts and only
  // when a barangay has been chosen (the geography is the required part).
  useEffect(() => {
    if (manual || !dirtyRef.current) return;
    const brgy = barangays.find((b) => b.code === brgyCode) ?? null;
    if (!brgy) return;

    const next = buildAddress(street, brgy);
    lastEmittedRef.current = next;
    if (next !== value) onChange(next);
  }, [street, brgyCode, barangays, manual, value, onChange]);

  function handleStreetChange(next: string) {
    dirtyRef.current = true;
    setStreet(next);
  }

  function handleBarangayChange(next: string) {
    dirtyRef.current = true;
    setBrgyCode(next);
  }

  const fieldBase = `h-12 w-full rounded-2xl border bg-muted/70 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-transparent focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
    hasError ? "border-red-400 bg-red-50/20" : "border-transparent"
  } ${disabled ? "opacity-60" : ""}`;
  const streetClass = `${fieldBase} px-4`;
  const selectClass = `${fieldBase} appearance-none pl-11 pr-10`;

  if (manual) {
    return (
      <div className="space-y-2">
        <textarea
          id={streetId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={3}
          autoComplete="street-address"
          placeholder={`${CITY_LABEL}, ${PROVINCE_LABEL}`}
          className="w-full rounded-2xl border border-input bg-muted/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-transparent focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        {!loadError && (
          <button
            type="button"
            onClick={() => setManual(false)}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Use the barangay selector instead
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor={streetId}
          className="block text-xs font-bold text-foreground"
        >
          Street / Purok / House &amp; Lot
        </label>
        <input
          id={streetId}
          type="text"
          value={street}
          onChange={(event) => handleStreetChange(event.target.value)}
          disabled={disabled || loading}
          autoComplete="street-address"
          placeholder="e.g., Purok 3, Block 2, Lot 5"
          className={streetClass}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor={brgyId}
          className="block text-xs font-bold text-foreground"
        >
          Barangay <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id={brgyId}
            value={brgyCode}
            onChange={(event) => handleBarangayChange(event.target.value)}
            disabled={disabled || loading || barangays.length === 0}
            className={selectClass}
          >
            <option value="">
              {loading
                ? "Loading barangays…"
                : barangays.length === 0
                ? "Barangay list unavailable"
                : "Select your barangay"}
            </option>
            {barangays.map((barangay) => (
              <option key={barangay.code} value={barangay.code}>
                {formatBarangayName(barangay.name)}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {loading && (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading the 80 barangays of San Pablo City…
          </p>
        )}
        {street && !brgyCode && !loading && (
          <p className="text-[11px] text-amber-600">
            Choose your barangay so sellers know where to deliver.
          </p>
        )}
      </div>

      <p className="rounded-xl bg-muted/60 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
        Delivering within <span className="text-foreground">{CITY_LABEL}</span>,{" "}
        {PROVINCE_LABEL} ({REGION_LABEL}) only.
      </p>

      {loadError && (
        <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
          <p className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Couldn&apos;t load the barangay list ({loadError}). You can still
              type your address manually.
            </span>
          </p>
          <button
            type="button"
            onClick={() => setManual(true)}
            className="font-bold text-primary hover:underline"
          >
            Enter address manually
          </button>
        </div>
      )}
    </div>
  );
}
