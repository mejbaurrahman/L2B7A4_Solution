import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import { ITechnicianProfileUpdate } from "./technician.interface";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const profileData: ITechnicianProfileUpdate = req.body;
  const technicianId = req.user?.id;
  const updatedProfile = await technicianService.updateTechnicianProfile(
    technicianId as string,
    profileData,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});

const getBookings = catchAsync(async (req: Request, res: Response) => {
  const technicianId = req.user?.id;
  const bookings = await technicianService.getTechnicianBookings(
    technicianId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});
const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const availability = req.body;
  const technicianId = req.user?.id;
  const updatedAvailability =
    await technicianService.updateTechnicianAvailability(
      technicianId as string,
      availability,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: updatedAvailability,
  });
});

export const technicianController = {
  updateProfile,
  updateAvailability,
  getBookings,
};
