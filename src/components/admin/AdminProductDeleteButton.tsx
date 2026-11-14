"use client";

import { useTransition } from "react";
import { adminDeleteProductAction } from "@/modules/admin/actions";

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
      className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 text-xs font-bold transition-all disabled:opacity-50"
    >
      {isPending ? "Removing..." : "Remove Listing"}
    </button>
  );
}
