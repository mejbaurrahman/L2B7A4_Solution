import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

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
  updateAvailability,
};
