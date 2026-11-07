"use server";

import { createClient } from "@/lib/supabase/server";
import { sellerReviewSchema } from "@/modules/admin/schemas";
import { requireAdmin } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

/**
 * Admin-only: approve or reject a seller application.
 * Updates sellers.status and upgrades profiles.role to 'seller' on approval.
 */
export async function reviewSellerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await requireAdmin();
  if (!user) {
    return { success: false, message: "Admin access required." };
  }

  const parsed = sellerReviewSchema.safeParse({
    seller_id: formData.get("seller_id"),
    action: formData.get("action"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
    };
  }

  const { seller_id, action } = parsed.data;
  const newStatus = action === "approve" ? "approved" : "rejected";

  const { error: sellerError } = await supabase
    .from("sellers")
    .update({ status: newStatus })
    .eq("id", seller_id);

  if (sellerError) {
    return { success: false, message: sellerError.message };
  }

  if (action === "approve") {
    const { data: seller } = await supabase
      .from("sellers")
      .select("profile_id")
      .eq("id", seller_id)
      .single();

    if (seller) {
      await supabase
        .from("profiles")
        .update({ role: "seller" })
        .eq("id", seller.profile_id);
    }
  }

  revalidatePath("/admin/sellers");
  return { success: true, message: `Seller ${action}d successfully.` };
}
