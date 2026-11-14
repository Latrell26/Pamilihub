# (SP) Pamilihub — User & Operator Guide

Welcome to the **Pamilihub** user manual. This guide provides step-by-step instructions for all three platform user roles: **Customers**, **Local Food Sellers**, and **Platform Administrators**.

---

## Part 1: Customer Guide

### 1. Account Setup
1. Visit the home page and click **"Sign Up"** in the top navigation.
2. Enter your email and a secure password (minimum 6 characters).
3. Once logged in, click your profile avatar in the header to navigate to `/profile`.
4. Enter your **Full Name**, **Active Phone Number**, and **Delivery Address in San Pablo City**. Click **"Save Changes"**.

### 2. Exploring San Pablo Delicacies
1. Navigate to **"Delicacies"** (`/products`) from the header navigation.
2. Filter products by clicking category badges (*Pies and Pastries*, *Kakanin*, *Coffee*, *Snacks*).
3. Use the search input to look up specific delicacies like *"Buko Pie"*, *"Espasol"*, or store names.
4. Click on any item to view details, stock availability, pricing, and seller store location.

### 3. Shopping Cart & Multi-Seller Ordering
1. Click **"Add to Cart"** on any in-stock delicacy.
2. Open the **Cart** via the shopping bag icon or the floating mobile bar.
3. Adjust item quantities using `+` and `-` buttons or click remove to discard an item.
4. Click **"Proceed to Checkout"**.
   - If your cart contains items from multiple merchants, the platform automatically splits them by seller and applies the standard flat **₱50 delivery fee** per seller.
5. Confirm your delivery name, phone number, and street address.
6. Select your payment method: **MockPay (Simulated Digital Payment)** or **Cash on Delivery (COD)**.
7. Click **"Place Order"**.

### 4. Completing Payment & Tracking Orders
- **For MockPay:** You are redirected to `/orders/[id]/pay`. Click **"Approve Payment"** to simulate a successful payment. (Or click "Cancel Payment" to cancel and restore item stock).
- **For Cash on Delivery:** Payment status remains pending until the delivery rider/seller completes delivery.
- View live order status at **"My Orders"** (`/orders`). Order statuses will progress through:
  `Pending` → `Accepted` → `Preparing` → `Delivering` → `Completed`.

---

## Part 2: Local Food Seller Guide

### 1. Applying as a San Pablo Food Merchant
1. Register and sign in as a standard user.
2. Navigate to **"Become a Seller"** or visit `/apply`.
3. Fill out your **Store Name**, **Store Description**, and **San Pablo Barangay/Location**.
4. Submit your application. It will be sent to the platform administrator for verification.

### 2. Managing Products & Inventory
1. Once approved, the header displays **"Products"** and **"Orders"**.
2. Visit `/seller/products` to manage your catalog:
   - Click **"Add New Product"**.
   - Enter name, description, price (₱), and available stock quantity.
   - Select the delicacy category.
   - Upload a product photo (PNG, JPG, or WebP).
3. To adjust pricing or stock levels, edit the values and click update.

### 3. Fulfilling Incoming Orders
1. Navigate to `/seller/orders`.
2. The left pane displays incoming orders with status badges and timestamps.
3. Click an order to open the **Order Detail Panel** on the right:
   - Review recipient name, contact phone number, and delivery address.
   - Review ordered delicacies, quantities, and payment status.
4. Use the action buttons to advance the order through the fulfillment pipeline:
   - **Accept Order:** Confirm you have received the order.
   - **Start Preparing:** Indicate the kitchen is baking or packing the food.
   - **Mark Delivering:** Indicate the order is out for delivery in San Pablo City.
   - **Mark Completed:** Confirm delivery. For COD orders, this automatically marks the payment as paid.
5. If unable to fulfill, click **"Reject Order"**. The system will automatically restore stock and simulate a refund if already paid.

---

## Part 3: Platform Administrator Guide

### 1. Executive Dashboard (`/admin/dashboard`)
- Review real-time Gross Merchandise Value (GMV) across completed orders.
- Track total orders and fulfillment distribution across pipeline stages.
- Monitor active vs. pending seller applications and catalog inventory levels.

### 2. Merchant Verification (`/admin/sellers`)
1. Open the **"Approvals"** tab.
2. Review applicant store names, descriptions, and owner contact details.
3. Click **"Approve"** to promote the applicant's account to the `seller` role, enabling them to upload products and receive orders.
4. Click **"Reject"** if the merchant does not meet local food standards.

### 3. Platform Order & Payment Audit (`/admin/orders`)
- Filter all orders across the entire platform by order fulfillment status, payment status, or keyword search.
- Audit order timestamps, delivery addresses, and payment transactions.

### 4. Catalog Moderation (`/admin/products`)
- Review all product listings across all San Pablo merchants.
- If a listing violates platform guidelines, click **"Remove Listing"** to unpublish the product.

### 5. Product Categories (`/admin/categories`)
- Add new categories (e.g., *Pasalubong*, *Beverages*).
- Rename or delete existing categories.

### 6. User Directory (`/admin/users`)
- Inspect registered user profiles, contact information, roles, and linked merchant stores.
