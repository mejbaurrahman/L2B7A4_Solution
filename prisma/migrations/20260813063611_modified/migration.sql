/*
  Warnings:

  - You are about to drop the column `averageRating` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `technician_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "technician_profiles_averageRating_idx";

-- DropIndex
DROP INDEX "technician_profiles_isAvailable_idx";

-- DropIndex
DROP INDEX "technician_profiles_location_isAvailable_idx";

-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "averageRating",
DROP COLUMN "isAvailable",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "technician_profiles_rating_idx" ON "technician_profiles"("rating");
