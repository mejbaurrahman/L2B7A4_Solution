import { prisma } from "../../lib/prisma";

const updateTechnicianAvailability = async (
  technicianId: string,
  availability: any,
) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }

  console.log(technician.id, technician.technicianProfile.id);
  const profileId = technician.technicianProfile.id;

  const start = new Date(availability.startTime);
  const end = new Date(availability.endTime);

  const existingSlot = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,
      startTime: start,
      endTime: end,
    },
  });

  if (existingSlot) {
    throw new Error("Availability slot already exists");
  }
  const newAvailability = await prisma.technicianAvailability.create({
    data: {
      technicianId: profileId,
      startTime: start,
      endTime: end,
      isAvailable: availability?.isAvailable,
    },
  });
  return newAvailability;
};

export const technicianService = {
  updateTechnicianAvailability,
};
