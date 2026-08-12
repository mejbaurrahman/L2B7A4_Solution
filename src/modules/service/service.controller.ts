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

export const serviceController = {
  createService,
};
