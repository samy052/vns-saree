-- Profile page support migration (Supabase/Postgres)
-- Schema assumed: vns_saree

ALTER TABLE vns_saree.customers
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS wallet_balance numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_code varchar,
  ADD COLUMN IF NOT EXISTS referred_by integer;

ALTER TABLE vns_saree.orders
  ADD COLUMN IF NOT EXISTS customer_id integer,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE TABLE IF NOT EXISTS vns_saree.wallet_transactions (
  id bigserial PRIMARY KEY,
  customer_id integer NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  available_at timestamptz NULL,
  dedupe_key text NOT NULL UNIQUE,
  meta jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

