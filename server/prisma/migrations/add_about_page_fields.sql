-- Add about page fields to GymSettings
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "phone2" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "aboutDescription" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "ownerName" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "ownerPhoto" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "ownerMessage" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "teamPhoto" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "gymPhotos" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "facilities" TEXT;
ALTER TABLE "GymSettings" ADD COLUMN IF NOT EXISTS "trainers" TEXT;
