-- Create the inventory table
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