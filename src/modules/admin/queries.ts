import { createClient } from "@/lib/supabase/server";

export type AdminDashboardMetrics = {
  totalRevenue: number;
  ordersCount: {
    total: number;
    pending: number;
    accepted: number;
    preparing: number;
    delivering: number;
    completed: number;
    cancelled: number;
    rejected: number;
  };
  sellersCount: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  usersCount: {
    total: number;
    customer: number;
    seller: number;
    admin: number;
  };
  productsCount: {
    total: number;
    inStock: number;
    outOfStock: number;
  };
  recentOrders: Array<{
    id: string;
    total: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    created_at: string;
    delivery_name: string;
    seller?: {
      store_name: string;
    } | null;
  }>;
  pendingSellers: Array<{
    id: string;
    store_name: string;
    location: string | null;
    created_at: string;
    profile?: {
      full_name: string | null;
      phone: string | null;
    } | null;
  }>;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = createClient();

  const [
    { data: orders },
    { data: sellers },
    { data: profiles },
    { data: products },
    { data: recentOrdersData },
    { data: pendingSellersData },
  ] = await Promise.all([
    supabase.from("orders").select("id, total, payment_status, order_status"),
    supabase.from("sellers").select("id, status"),
    supabase.from("profiles").select("id, role"),
    supabase.from("products").select("id, stock"),
    supabase
      .from("orders")
      .select("id, total, payment_method, payment_status, order_status, created_at, delivery_name, seller:sellers(store_name)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("sellers")
      .select("id, store_name, location, created_at, profile:profiles(full_name, phone)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  // Orders breakdown & revenue
  let totalRevenue = 0;
  const ordersCount = {
    total: orders?.length ?? 0,
    pending: 0,
    accepted: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
  };

  (orders ?? []).forEach((o) => {
    if (o.payment_status === "paid" || o.order_status === "completed") {
      totalRevenue += Number(o.total || 0);
    }
    const status = o.order_status as keyof typeof ordersCount;
    if (status in ordersCount && status !== "total") {
      ordersCount[status]++;
    }
  });

  // Sellers breakdown
  const sellersCount = {
    total: sellers?.length ?? 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  };
  (sellers ?? []).forEach((s) => {
    if (s.status === "approved") sellersCount.approved++;
    else if (s.status === "pending") sellersCount.pending++;
    else if (s.status === "rejected") sellersCount.rejected++;
  });

  // Users breakdown
  const usersCount = {
    total: profiles?.length ?? 0,
    customer: 0,
    seller: 0,
    admin: 0,
  };
  (profiles ?? []).forEach((p) => {
    if (p.role === "customer") usersCount.customer++;
    else if (p.role === "seller") usersCount.seller++;
    else if (p.role === "admin") usersCount.admin++;
  });

  // Products breakdown
  const productsCount = {
    total: products?.length ?? 0,
    inStock: 0,
    outOfStock: 0,
  };
  (products ?? []).forEach((p) => {
    if ((p.stock ?? 0) > 0) productsCount.inStock++;
    else productsCount.outOfStock++;
  });

  return {
    totalRevenue,
    ordersCount,
    sellersCount,
    usersCount,
    productsCount,
    recentOrders: (recentOrdersData ?? []) as unknown as AdminDashboardMetrics["recentOrders"],
    pendingSellers: (pendingSellersData ?? []) as unknown as AdminDashboardMetrics["pendingSellers"],
  };
}

export type AdminOrderRow = {
  id: string;
  customer_id: string;
  seller_id: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  customer: {
    id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  seller: {
    id: string;
    store_name: string;
    location: string | null;
  } | null;
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product: {
      name: string;
      image_url: string | null;
    } | null;
  }>;
  payments: Array<{
    id: string;
    method: string;
    status: string;
    created_at: string;
  }>;
};


export async function getAdminOrders(filters?: {
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
}): Promise<AdminOrderRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      seller_id,
      delivery_name,
      delivery_phone,
      delivery_address,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      order_status,
      created_at,
      customer:profiles(id, full_name, phone, address),
      seller:sellers(id, store_name, location),
      order_items(id, quantity, unit_price, product:products(name, image_url)),
      payments(id, method, status, created_at)
    `)
    .order("created_at", { ascending: false });

  if (filters?.orderStatus && filters.orderStatus !== "all") {
    query = query.eq("order_status", filters.orderStatus);
  }

  if (filters?.paymentStatus && filters.paymentStatus !== "all") {
    query = query.eq("payment_status", filters.paymentStatus);
  }

  

  const { data, error } = await query;
  if (error || !data) return [];
 

  let results = data as unknown as AdminOrderRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((o) => {
      const matchId = o.id.toLowerCase().includes(term);
      const matchName = o.delivery_name.toLowerCase().includes(term);
      const matchSeller = o.seller?.store_name.toLowerCase().includes(term);
      const matchPhone = o.delivery_phone.toLowerCase().includes(term);
      return matchId || matchName || matchSeller || matchPhone;
      return Boolean(matchId || matchName || matchSeller || matchPhone);
    });
  }

  return results;
  
}

export type AdminProductRow = {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  seller: {
    id: string;
    store_name: string;
    status: string;
    location: string | null;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
};

export async function getAdminProducts(filters?: {
  categoryId?: string;
  search?: string;
}): Promise<AdminProductRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      seller_id,
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
      created_at,
      seller:sellers(id, store_name, status, location),
      category:categories(id, name)
    `)
    .order("created_at", { ascending: false });

  if (filters?.categoryId && filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as unknown as AdminProductRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchSeller = p.seller?.store_name.toLowerCase().includes(term);
      const matchCat = p.category?.name.toLowerCase().includes(term);
      return matchName || matchSeller || matchCat;
    });
  }

  return results;
}

export type AdminUserRow = {
  id: string;
  role: "customer" | "seller" | "admin";
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  seller?: {
    store_name: string;
    status: string;
  } | null;
};

export async function getAdminUsers(filters?: {
  role?: string;
  search?: string;
}): Promise<AdminUserRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("profiles")
    .select(`
      id,
      role,
      full_name,
      phone,
      address,
      created_at,
      seller:sellers(store_name, status)
    `)
    .order("created_at", { ascending: false });

  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as unknown as AdminUserRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((u) => {
      const matchName = (u.full_name ?? "").toLowerCase().includes(term);
      const matchPhone = (u.phone ?? "").toLowerCase().includes(term);
      const matchAddress = (u.address ?? "").toLowerCase().includes(term);
      const matchStore = (u.seller?.store_name ?? "").toLowerCase().includes(term);
      return matchName || matchPhone || matchAddress || matchStore;
    });
  }

  return results;
}
