-- Migration to simplify from SaaS to single gym
-- Remove gymId references and Gym/Subscription tables

-- Drop foreign key constraints first
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_gymId_fkey";
ALTER TABLE "Member" DROP CONSTRAINT IF EXISTS "Member_gymId_fkey";
ALTER TABLE "MembershipPlan" DROP CONSTRAINT IF EXISTS "MembershipPlan_gymId_fkey";
ALTER TABLE "Attendance" DROP CONSTRAINT IF EXISTS "Attendance_gymId_fkey";
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_gymId_fkey";
ALTER TABLE "Subscription" DROP CONSTRAINT IF EXISTS "Subscription_gymId_fkey";

-- Drop indexes
DROP INDEX IF EXISTS "User_gymId_idx";
DROP INDEX IF EXISTS "Member_gymId_idx";
DROP INDEX IF EXISTS "MembershipPlan_gymId_idx";
DROP INDEX IF EXISTS "Attendance_gymId_idx";
DROP INDEX IF EXISTS "Payment_gymId_idx";
DROP INDEX IF EXISTS "Gym_slug_idx";

-- Remove gymId columns
ALTER TABLE "User" DROP COLUMN IF EXISTS "gymId";
ALTER TABLE "Member" DROP COLUMN IF EXISTS "gymId";
ALTER TABLE "MembershipPlan" DROP COLUMN IF EXISTS "gymId";
ALTER TABLE "Attendance" DROP COLUMN IF EXISTS "gymId";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "gymId";

-- Drop tables
DROP TABLE IF EXISTS "Subscription";
DROP TABLE IF EXISTS "Gym";

-- Update enum to remove SUPER_ADMIN and OWNER
ALTER TYPE "Role" RENAME TO "Role_old";
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TRAINER', 'STAFF', 'MEMBER');

-- Update existing data
UPDATE "User" SET role = 'ADMIN' WHERE role IN ('SUPER_ADMIN', 'OWNER');

-- Change column type
ALTER TABLE "User" ALTER COLUMN role TYPE "Role" USING role::text::"Role";

-- Drop old enum
DROP TYPE "Role_old";

-- Add new columns to Member
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Member" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';