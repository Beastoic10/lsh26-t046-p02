# Pharmacy Expiry Shelf Check

An automated inventory monitoring system designed for local community pharmacies in Bangladesh (e.g., Khulna region) to eliminate financial loss caused by unsold expired medicines. It tracks expiration timelines relative to the current date, calculates financial risk in BDT, and manages distributor return workflows.

---

## Key Features

- **Dynamic Risk Categorization:** Automatically groups medicines into four categories calculated against the live date:
  - **Expired:** Expiry date has passed.
  - **Expiring within 30 days:** High-priority risk (0 to 30 days remaining, inclusive).
  - **Expiring within 90 days:** Moderate-priority risk (31 to 90 days remaining).
  - **Safe:** More than 90 days remaining.
- **Financial Risk Metrics:** Computes loss exposure (`Quantity` × `Unit Purchase Price in BDT`) separately for Expired stock and the 0–30 day Expiring Soon group.
- **Distributor Return Workflow:** Mark high-risk or expired inventory as returned to remove items and their corresponding financial value from active counts and dashboards into a historical "Returned" ledger.
- **Visual Analytics:** Interactive monthly bar chart showing financial value at risk over the next 6 months.
- **Fast Search & Filter:** Quick real-time filtering by medicine name, batch number, or pharmaceutical company.
- **Quick-Add Inventory Form:** Rapid entry pre-filling default shelf-life timelines for common formulations.

---

## Tech Stack

- **Frontend:** Next.js (App Router, React 19, Tailwind CSS)
- **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL, Row Level Security, Realtime updates)
- **State & Data Fetching:** React Query / Server Components
- **Charts:** Recharts

---

## Database Schema & Logic

The solution relies on a PostgreSQL table hosted in Supabase:


CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    batch TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    expiry_date DATE NOT NULL,
    -- DECIMAL(10,2) prevents JavaScript floating point errors at the DB level
    unit_price_bdt DECIMAL(10, 2) NOT NULL,
    -- Status handles the R-24 return requirement
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster date and status filtering on the dashboard
CREATE INDEX idx_medicines_status_expiry ON medicines(status, expiry_date);