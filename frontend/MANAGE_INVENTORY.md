Manage Inventory — Overview

This file documents the Manage Inventory UI and API usage.

Frontend:
- Route: `/seller/manage-inventory` (also embeddable in Dashboard page)
- Main component: `src/components/ManageInventoryComponent.jsx`
- Subcomponents: `SummaryCards`, `FilterBar`, `DataTable`, `EditModal`, `Toasts`

Backend endpoints used:
- GET /api/products/vendor/:vendor_id — list vendor products (includes `in_stock`)
- PUT /api/products/:product_id — update price/description (body: `{ vendor_id, price, description }`)
- PATCH /api/products/:product_id/availability — toggle availability (body: `{ vendor_id }`)
- DELETE /api/products/:product_id — delete (body: `{ vendor_id }`)

Notes:
- Database schema includes `in_stock BOOLEAN DEFAULT true`. If your database predates this change, run: `ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NOT NULL DEFAULT true;`
- The embedded Dashboard toggle is lazily loaded to avoid increasing initial bundle size.
- The Manage Inventory UI has basic accessibility and mobile-friendly layout. If you want keyboard navigation improvements, I can add them (Esc to close modal/lightbox, focus traps, etc.).