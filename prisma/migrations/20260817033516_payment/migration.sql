/*
  Warnings:

  - You are about to drop the column `provider` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_provider_idx";

-- DropIndex
DROP INDEX "payments_provider_status_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "provider";

-- DropEnum
DROP TYPE "PaymentProvider";
