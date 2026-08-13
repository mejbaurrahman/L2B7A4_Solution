import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { Request, Response } from "express";
import httpStatus from "http-status";
import { categoryService } from "./category.service";
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

export const categoryController = {
  getAllCategories,
};
