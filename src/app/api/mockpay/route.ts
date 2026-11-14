import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

/** MockPay payment request validation. */
const mockpaySchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  amount: z.number().positive("Amount must be positive"),
  result: z.enum(["approve", "cancel"]),
});

/** Build a Supabase client from the request's session cookies (browser flow). */
function cookieClient() {
  return createClient();
}

/** Build a Supabase client from a Bearer token (Postman flow). */
function tokenClient(token: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function POST(req: Request) {
  // ---- Auth: signed-in customer session (cookie or Bearer token) ----
  const authHeader = req.headers.get("authorization");
  let supabase: ReturnType<typeof createClient>;
  let userId: string | null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    supabase = tokenClient(token) as unknown as ReturnType<typeof createClient>;
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id ?? null;
  } else {
    supabase = cookieClient();
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id ?? null;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Role: customer only
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (profile?.role !== "customer") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ---- Validate request body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = mockpaySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Validation error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { order_id, amount, result } = parsed.data;

  // ---- Verify order exists, belongs to caller, amount matches, awaiting payment ----
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, total, payment_status, payment_method, order_status")
    .eq("id", order_id)
    .single();

  if (!order || orderError) {
    return new Response(
      JSON.stringify({ error: "Order not found or not awaiting payment." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (order.customer_id !== userId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Only MockPay orders can be paid here
  if (order.payment_method !== "mockpay") {
    return new Response(
      JSON.stringify({ error: "This order was not placed via MockPay." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Cannot pay a terminal order
  if (order.order_status !== "pending") {
    return new Response(
      JSON.stringify({ error: "Order is no longer awaiting payment." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (order.payment_status !== "pending") {
    return new Response(
      JSON.stringify({ error: "Order not found or not awaiting payment." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (Number(order.total) !== amount) {
    return new Response(JSON.stringify({ error: "Amount does not match order total" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ---- Process the simulated payment via the DB function ----
  const { error: rpcError } = await supabase.rpc("process_mockpay", {
    p_order_id: order_id,
    p_amount: amount,
    p_result: result,
  });

  if (rpcError) {
    return new Response(JSON.stringify({ error: rpcError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payment_status = result === "approve" ? "paid" : "cancelled";
  const message =
    result === "approve"
      ? "Payment approved (simulated)."
      : "Payment cancelled. Stock has been restored.";

  return Response.json({ order_id, payment_status, message });
}
