-- Add terms-of-service tracking columns to purchases.
-- These were added to prisma/schema.prisma but never propagated to the
-- database, which caused the Stripe webhook to crash with P2022:
--   The column `terms_version` does not exist in the current database.

ALTER TABLE "public"."purchases"
    ADD COLUMN IF NOT EXISTS "terms_version" text,
    ADD COLUMN IF NOT EXISTS "terms_accepted_at" timestamp with time zone,
    ADD COLUMN IF NOT EXISTS "terms_accepted_ip" text,
    ADD COLUMN IF NOT EXISTS "terms_user_agent" text;
