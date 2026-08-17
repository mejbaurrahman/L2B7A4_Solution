import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";

const createBooking = async (customerId: string, payload: ICreateBooking) => {
  const checkService = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
    include: {
      technician: true,
    },
  });
  if (!checkService) {
    throw new Error("Selected service does not exist");
  }
  if (checkService.technician?.id !== payload.technicianId) {
    throw new Error(
      "Selected service does not belong to the selected technician",
    );
  }

  const technicianProfile = await prisma.user.findUnique({
    where: {
      id: payload.technicianId,
    },
    include: {
      technicianProfile: true,
    },
  });

  const technicianId = technicianProfile?.technicianProfile?.id;
  if (!technicianId) {
    throw new Error("Technician profile not found");
  }

  const technicianAvailability = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId,
    },
    include: {
      availability: true,
    },
  });

  if (
    !technicianAvailability?.availability.some(
      (availability) => availability.id === payload.availabilityId,
    )
  ) {
    throw new Error(
      "Selected availability does not belong to the selected technician",
    );
  }

  const availability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId,
    },
  });

  if (!availability?.isAvailable) {
    throw new Error("Selected availability is not available");
  }
  await prisma.technicianAvailability.update({
    where: {
      id: payload.availabilityId,
    },
    data: {
      isAvailable: false,
    },
  });
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      bookingDate: payload.bookingDate,
      totalAmount: payload.totalAmount,
      availabilityId: payload.availabilityId,

      ...(payload.note && {
        note: payload.note,
      }),
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      service: true,
    },
  });

  return booking;
};
const getMyBookings = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getBookingById = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      payment: true,
      review: true,
    },
  });

  return booking;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
};
