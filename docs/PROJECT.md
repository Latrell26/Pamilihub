# PROJECT — (SP) Pamilihub

## Title
(SP) Pamilihub: A Web-Based E-Commerce Platform for Local Food Products of San Pablo City, Laguna

## Problem summary
- Small food producers in San Pablo City commonly sell through word of mouth, public markets, roadside stalls, and social media. Online orders often arrive via Facebook Messenger or text.
- Orders get scattered across chats, payments need manual screenshot checking, and stock/sales records may be kept in notebooks or not recorded consistently. This can cause lost orders, overselling, and payment-verification mistakes.
- Buyers (residents, visitors, relatives wanting *pasalubong*) must search many pages and groups to find sellers and have no single place to compare products, check availability, and order.

**General problem:** Local food producers need an affordable and organized online platform to showcase products and manage orders, while buyers need a convenient place to discover and order local food products.

## Specific problems → objectives
| # | Problem | Objective |
|---|---|---|
| 1 | How do sellers currently manage listings, stock, orders, payments, and what difficulties arise? | Interview at least three San Pablo sellers and survey a small sample of buyers; summarize findings. *(⚠ CONFIRM WITH GROUP: numbers)* |
| 2 | How can buyers discover, compare, and order from one platform? | Customer modules: catalog with category browsing and search, product detail pages, cart, order placement. |
| 3 | How can checkout and payment be clear and demonstrable? | Checkout with delivery information; MockPay and cash on delivery; record payment result; update order/payment status visibly. |
| 4 | How can access be controlled by role? | Authentication, role-based access control, input validation, clear system messages, minimal personal data. |
| 5 | How can a modular structure and standard data formats support communication? | Modular system (accounts, catalog, orders, payments, administration); MockPay as a REST-style API route with JSON, tested in Postman. |
| 6 | How will the system be evaluated? | Functional testing with documented test cases; user evaluation by at least 15 respondents using an ISO/IEC 25010:2011 questionnaire (functional suitability, usability, security, performance efficiency). *(⚠ CONFIRM WITH GROUP: sample size)* |

## Roles
| Role | Can do |
|---|---|
| **Customer** | Register/login, manage profile, browse by category, search by name, view product details (photos, price, stock, seller info), cart, checkout with delivery info, pay via MockPay or COD, view order history and status. |
| **Seller** | Apply for a seller account (needs admin approval), store profile (name, description, location), add/edit/delete products with images, manage stock, view incoming orders, accept/reject, update preparing/delivering status. |
| **Admin** | Approve/reject seller applications, manage users and categories, moderate product listings, monitor orders and payment statuses, view a basic dashboard. |

## System-wide features
Three roles only · role-based access control · server-side validation with clear error/success messages · secure password handling via Supabase Auth · responsive UI for mobile and desktop.

## Optional enhancements (only after all core features work)
Product reviews and ratings · basic sales/order summary for sellers.

## Scope
- Web marketplace for local food and delicacy products of San Pablo City, Laguna.
- Limited number of approved local producers; sample or actual seller accounts for testing.
- Core: product listing, search, cart, checkout, order-status tracking.
- Simulated payment (MockPay) and cash on delivery.
- Manual order/delivery-status updates by the seller; no rider interface.
- Responsive web interface; deployed on Vercel where feasible, otherwise demonstrated locally.

## Limitations
- Payments are simulated; no real PayPal, PayMongo, GCash, card, or other transactions.
- No rider management or courier integration; no GPS tracking or automatic rider assignment.
- Delivery status is updated manually by seller or admin.
- Testing limited to a small number of sample or approved sellers, products, and customer accounts.
- Delivery fee is a simplified flat fee per seller order, not distance-based. *(⚠ CONFIRM WITH GROUP)*
- Personal data limited to what accounts and delivery need; no formal Data Privacy Act compliance audit.
- No native mobile app. AI recommendations, multi-currency, multi-language are out of scope.

## Expected output
Working application with the three roles · catalog, cart, checkout, order tracking · MockPay demo · seller workflow · documentation (system design, technical docs, basic user guide, testing results) · repository with setup instructions and sample data · evaluation results.
