import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateBooking {
  technicianId: string;
  serviceId: string;
  bookingDate: Date;
  availabilityId: string;
  totalAmount: number;
  note?: string;
}

export interface IBooking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  bookingDate: Date;
  availabilityId: string;
  status: BookingStatus;
  totalAmount: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}
