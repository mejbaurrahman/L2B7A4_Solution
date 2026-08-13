import { sendResponse } from "../../utils/sendResponse";

import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { technicianService } from "./technicians.service";

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
  const technicians = await technicianService.getAllTechniciansFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians retrieved successfully",
    data: technicians,
  });
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const technician = await technicianService.getTechnicianByIdFromDB(
    id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician retrieved successfully",
    data: technician,
  });
});
export const technicianController = {
  getAllTechnicians,
  getTechnicianById,
};
