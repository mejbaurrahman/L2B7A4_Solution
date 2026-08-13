import { Request, Response } from "express";
import { serviceService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";

const createService = async (req: Request, res: Response) => {
  const technicianId = req.user?.id;

  const result = await serviceService.createService(
    technicianId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Service created successfully",
    data: result,
  });
};

const getAllServices = async (req: Request, res: Response) => {
  const query = req.query;
  const result = await serviceService.getAllServices(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Services retrieved successfully",
    data: result,
  });
};

export const serviceController = {
  createService,
  getAllServices,
};
