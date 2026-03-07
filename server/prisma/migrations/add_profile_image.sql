-- Add profileImage column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileImage" TEXT;
