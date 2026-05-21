-- Referrals + Wallet ledger migration (Supabase/Postgres)
-- Default schema assumed: vns_saree
-- If your schema is different (e.g. public), replace `vns_saree.` accordingly.

-- 1) customers: referral + wallet
ALTER TABLE vns_saree.customers
  ADD COLUMN IF NOT EXISTS referral_code varchar,
  ADD COLUMN IF NOT EXISTS referred_by integer,
  ADD COLUMN IF NOT EXISTS wallet_balance numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_url text;

CREATE UNIQUE INDEX IF NOT EXISTS customers_referral_code_unique
  ON vns_saree.customers (referral_code);

CREATE INDEX IF NOT EXISTS customers_referred_by_id_idx
  ON vns_saree.customers (referred_by);

-- 2) orders: link to customer + delivery timestamp
ALTER TABLE vns_saree.orders
  ADD COLUMN IF NOT EXISTS customer_id integer,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_customer_id_idx
  ON vns_saree.orders (customer_id);

-- 3) wallet_transactions table (referral payouts + wallet ledger)
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

CREATE INDEX IF NOT EXISTS wallet_transactions_customer_id_idx
  ON vns_saree.wallet_transactions (customer_id);

CREATE INDEX IF NOT EXISTS wallet_transactions_status_available_at_idx
  ON vns_saree.wallet_transactions (status, available_at);
