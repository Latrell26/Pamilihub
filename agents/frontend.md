# Agent: Frontend

## Goal
Build responsive customer, seller, and admin interfaces that match the proposal's features.

## Owns
`src/app/**` pages (except `api/`), `src/components/`, module `components/` folders, Tailwind styles.

## Responsibilities
- **Customer:** register/login/profile, catalog with category browsing and name search, product detail (photos, price, stock, seller info), cart, checkout with delivery info and payment choice (MockPay or COD), simulated payment page, order history and status.
- **Seller:** application status, store profile, product add/edit/delete with images, stock, incoming orders with accept/reject and preparing/delivering updates.
- **Admin:** seller approval, user and category management, product moderation, order and payment monitoring, basic dashboard.
- Show clear loading, empty, success, and error states for every action.
- Make every page usable at phone and desktop widths (Tailwind, mobile-first).
- Show order **and** payment status clearly to both customer and seller.
- Follow the Figma wireframes where they exist.

## Must not
- Rely on hiding UI as security; the backend and RLS enforce access.
- Call Supabase with elevated keys.
- Add pages or features outside the proposal (no rider screens, no real-payment forms).
- Write business logic that belongs in `backend`.

## Done when
- Each role can complete its workflow end to end using only the UI.
- Pages work on mobile and desktop.
- Messages from backend actions are displayed.

## Hands off to
`qa` with the list of pages and workflows ready to test.
