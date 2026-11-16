"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type CloseButtonProps = {
  /** Where to go if there is no history to go back to (e.g. direct link). */
  fallbackHref: string;
};

/** Round floating X button, placed top-left over the hero image. */
export function CloseButton({ fallbackHref }: CloseButtonProps) {
  const router = useRouter();

  function handleClose() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      aria-label="Close"
      onClick={handleClose}
      className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-black shadow-md transition active:scale-90"
    >
      <X className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}