-- Add planType and features to MembershipPlan
ALTER TABLE "MembershipPlan" ADD COLUMN IF NOT EXISTS "planType" TEXT NOT NULL DEFAULT 'GYM';
ALTER TABLE "MembershipPlan" ADD COLUMN IF NOT EXISTS "features" TEXT;

-- Add pricing and timing fields to GymSettings
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "admissionCharge" INTEGER NOT NULL DEFAULT 600;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "monthlyCharge" INTEGER NOT NULL DEFAULT 800;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "morningTiming" TEXT NOT NULL DEFAULT '6:00 AM - 11:00 AM';
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "eveningTiming" TEXT NOT NULL DEFAULT '4:00 PM - 10:00 PM';

-- Create index on planType
CREATE INDEX IF NOT EXISTS "MembershipPlan_planType_idx" ON "MembershipPlan"("planType");
