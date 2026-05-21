-- Saved addresses + live location support (Supabase/Postgres)
-- Schema assumed: vns_saree

-- 1) customer_addresses: up to 3 per customer (enforced in API)
CREATE TABLE IF NOT EXISTS vns_saree.customer_addresses (
  id bigserial PRIMARY KEY,
  customer_id integer NOT NULL,
  label text NULL,
  name text NULL,
  phone text NULL,
  address_line1 text NOT NULL,
  address_line2 text NULL,
  city text NULL,
  state text NULL,
  pincode text NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_addresses_customer_id_idx
  ON vns_saree.customer_addresses (customer_id);
