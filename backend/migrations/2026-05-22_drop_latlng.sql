-- Drop latitude/longitude columns (Supabase/Postgres)
-- Run this ONLY if you already created these columns and now want them removed.
-- Schema assumed: vns_saree

ALTER TABLE vns_saree.customers
  DROP COLUMN IF EXISTS last_location_lat,
  DROP COLUMN IF EXISTS last_location_lng,
  DROP COLUMN IF EXISTS last_location_at;

ALTER TABLE vns_saree.customer_addresses
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude;

