# DATABASE (Supabase PostgreSQL)

> Table and column names below are a **proposed design** derived from the proposal's features. ⚠ CONFIRM WITH GROUP before the database agent finalizes migrations.

## Tables
| Table | Purpose | Key fields |
|---|---|---|
| `profiles` | One row per user, linked to Supabase Auth | `id` (= auth user id), `role` (`customer`/`seller`/`admin`), `full_name`, `phone`, `address` |
| `sellers` | Store profile and approval | `id`, `profile_id`, `store_name`, `description`, `location`, `status` (`pending`/`approved`/`rejected`) |
| `categories` | Product categories (e.g., pies and pastries, kakanin, coffee, snacks) | `id`, `name` |
| `products` | Product listings | `id`, `seller_id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url` |
| `orders` | One order per seller | `id`, `customer_id`, `seller_id`, `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_fee`, `total`, `payment_method` (`mockpay`/`cod`), `payment_status`, `order_status`, `created_at` |
| `order_items` | Items in an order | `id`, `order_id`, `product_id`, `quantity`, `unit_price` |
| `payments` | Record of each simulated payment result | `id`, `order_id`, `method`, `status`, `created_at` |
| `reviews` | *Optional enhancement only* | `id`, `product_id`, `customer_id`, `rating`, `comment` |

Cart contents may live in client state or a `cart_items` table; the group decides. ⚠ CONFIRM WITH GROUP

## Status values
- **Seller status:** `pending`, `approved`, `rejected`
- **Order status:** `pending`, `accepted`, `rejected`, `preparing`, `delivering`, `completed`, `cancelled`
- **Payment status:** `pending`, `paid`, `failed`, `cancelled`, `refunded` (refunded is simulated only) ⚠ CONFIRM WITH GROUP

## RLS policy outline
| Table | Customer | Seller | Admin |
|---|---|---|---|
| `profiles` | read/update own | read/update own | read/update all |
| `sellers` | read approved stores | read/update own | read/update all |
| `categories` | read | read | full control |
| `products` | read products of approved sellers | CRUD own products only if seller is approved | read all, moderate/delete |
| `orders` | create; read own | read/update status of orders for own store | read all |
| `order_items` | create with own order; read own | read for own store's orders | read all |
| `payments` | read own | read for own store's orders | read all |

Rules:
- A seller can add products only when `sellers.status = 'approved'`.
- Customers cannot change `order_status`; only the seller (for their store's orders) or admin can.
- Customers cannot set `payment_status` directly; only the MockPay route and seller/admin flows can.
- Product images go to a Supabase Storage bucket; sellers can write only under their own folder; reads are public.

## Seed data (for demo and testing)
Include one admin, at least two approved sellers with products across the categories, one pending seller, and a few customers.
