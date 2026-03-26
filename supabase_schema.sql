-- 1. Events Table (To distinguish between Lamaran and Wedding)
CREATE TABLE events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL, -- e.g., 'Lamaran', 'Wedding'
  target_date date,
  icon_name text, -- String to reference a UI icon
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Dynamic Categories Table (Allows users to manage their own budget items)
CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g., 'Catering', 'Venue', 'MUA', 'Decor'
  target_amount numeric DEFAULT 0,
  allocated_amount numeric DEFAULT 0, -- Current savings allocated to this item
  status text DEFAULT 'Unpaid', -- e.g., 'Unpaid', 'DP Paid', 'Paid in Full'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Transactions Table (Savings log)
CREATE TABLE transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL, -- Optional: link to specific item
  amount numeric NOT NULL,
  description text,
  contributor_name text, -- The name of the partner who saved
  receipt_url text, -- Storage URL for receipt image
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;

-- RLS (Basic - enabling all for authenticated users)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated users" ON transactions FOR ALL USING (auth.role() = 'authenticated');
