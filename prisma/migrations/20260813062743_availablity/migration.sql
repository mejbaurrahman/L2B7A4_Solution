-- CreateTable
CREATE TABLE "technician_availabilities" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "technician_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "technician_availabilities_technicianId_idx" ON "technician_availabilities"("technicianId");

-- AddForeignKey
ALTER TABLE "technician_availabilities" ADD CONSTRAINT "technician_availabilities_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
