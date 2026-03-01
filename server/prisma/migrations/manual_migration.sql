-- Manual Migration: Allow SUPER_ADMIN to have no gym
-- Run this SQL directly in your Supabase SQL editor if migration fails

-- Make gymId nullable in User table
ALTER TABLE "User" ALTER COLUMN "gymId" DROP NOT NULL;

-- Make gym relation optional
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_gymId_fkey";
ALTER TABLE "User" ADD CONSTRAINT "User_gymId_fkey" 
  FOREIGN KEY ("gymId") REFERENCES "Gym"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;
