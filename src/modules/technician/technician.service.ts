import { prisma } from "../../lib/prisma";
import { ITechnicianProfileUpdate } from "./technician.interface";

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

const updateTechnicianProfile = async (
  technicianId: string,
  profileData: ITechnicianProfileUpdate,
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

  const profileId = technician.technicianProfile.id;

  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      id: profileId,
    },
    data: profileData,
  });

  return updatedProfile;
};

const getTechnicianBookings = async (technicianId: string) => {
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

  const bookings = await prisma.booking.findMany({
    where: {
      technicianId,
    },
  });
  return bookings;
};
export const technicianService = {
  updateTechnicianAvailability,
  updateTechnicianProfile,
  getTechnicianBookings,
};
