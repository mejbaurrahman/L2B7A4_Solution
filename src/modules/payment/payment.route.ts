import express from "express";

import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);
router.post(
  "/confirm",
  express.raw({
    type: "application/json",
  }),
  paymentController.confirmPayment,
);

router.get("/", auth(Role.CUSTOMER), paymentController.getPayments);

router.get("/:id", auth(Role.CUSTOMER), paymentController.getPaymentById);

export const paymentRoute = router;
