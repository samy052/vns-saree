-- Phone verification support (Firebase Auth Phone OTP)
-- Schema assumed: vns_saree

ALTER TABLE vns_saree.customers
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS firebase_phone_uid text;

