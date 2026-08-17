import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";

const createBooking = async (customerId: string, payload: ICreateBooking) => {
  const checkAvailability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId,
    },
  });
  if (!checkAvailability) {
    throw new Error("Selected availability slot does not exist");
  }
  if (!checkAvailability?.isAvailable) {
    throw new Error("Selected availability slot is not available");
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
