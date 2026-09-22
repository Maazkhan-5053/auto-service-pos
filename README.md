# GearHead POS — Car Mechanic Point of Sale System

A full point-of-sale and shop-management system for an auto repair shop, built with React + Vite + Tailwind CSS. All data is stored in your browser's `localStorage` — no backend or database setup needed.

## Features
- Role-based login (Admin, Manager, Cashier, Mechanic) with different access per role
- POS checkout: parts + labor cart, discounts, tax, cash/card/split payment, printable receipt
- Work orders: create, assign to mechanic, track status, add parts/labor, convert to invoice
- Customer & vehicle database with service history
- Inventory management with low-stock alerts (auto-deducts on sale)
- Appointment scheduling
- Invoice history
- Employee management (Admin only)
- Sales & performance reports (Admin/Manager)
- Shop settings (tax rate, labor rate, receipt footer)

## Requirements
- [Node.js](https://nodejs.org/) version 18 or later (includes `npm`). Check with:
  ```
  node -v
  ```

## How to run it on your laptop

1. **Unzip** the project folder and open a terminal inside it (e.g. `cd mechanic-pos`).

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the app:**
   ```
   npm run dev
   ```

4. Open the URL shown in the terminal — usually **http://localhost:5173** — in your browser.

5. **Log in** with one of the demo accounts shown on the login screen (click one to auto-fill):
   - Admin: `admin` / `admin123`
   - Manager: `manager` / `manager123`
   - Cashier: `cashier` / `cashier123`
   - Mechanic: `mike` / `mech123`

That's it — the app comes pre-loaded with sample customers, vehicles, parts, and work orders so you can explore right away.

## Notes
- Data persists in your browser's localStorage. Clearing browser data/site data will reset it back to the seed data.
- To deploy it online later, run `npm run build` — this produces a static `dist/` folder you can host anywhere (Vercel, Netlify, your own server, etc.).
- To connect this to a real backend/database down the line, the `DataContext.jsx` and `AuthContext.jsx` files are the two places all read/write logic lives — swap the localStorage calls there for API calls.
