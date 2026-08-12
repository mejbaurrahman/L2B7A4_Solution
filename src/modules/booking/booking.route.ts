import { Router } from "express";

import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);

router.get("/", auth(Role.CUSTOMER), bookingController.getMyBookings);

router.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingById);

export const bookingRoute = router;
