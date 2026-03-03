/*
  Warnings:

  - The values [SUPER_ADMIN,OWNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `gymId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `gymId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `gymId` on the `MembershipPlan` table. All the data in the column will be lost.
  - You are about to drop the column `gymId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gymId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Gym` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'TRAINER', 'STAFF', 'MEMBER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_gymId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_gymId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipPlan" DROP CONSTRAINT "MembershipPlan_gymId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_gymId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_gymId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gymId_fkey";

-- DropIndex
DROP INDEX "Attendance_gymId_idx";

-- DropIndex
DROP INDEX "Member_gymId_idx";

-- DropIndex
DROP INDEX "MembershipPlan_gymId_idx";

-- DropIndex
DROP INDEX "Payment_gymId_idx";

-- DropIndex
DROP INDEX "User_gymId_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "gymId";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "gymId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MembershipPlan" DROP COLUMN "gymId";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "gymId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gymId";

-- DropTable
DROP TABLE "Gym";

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "SubscriptionPlan";
