"use client";

import { useTransition } from "react";
import { adminDeleteProductAction } from "@/modules/admin/actions";
import { Trash2 } from "lucide-react";

interface AdminProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export default function AdminProductDeleteButton({
  productId,
  productName,
}: AdminProductDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the platform? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("product_id", productId);
      const res = await adminDeleteProductAction(null, fd);
      if (!res.success) {
        alert(res.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Remove ${productName}`}
      className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer shrink-0"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span>{isPending ? "Removing..." : "Remove"}</span>
    </button>
  );
}
