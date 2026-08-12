import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  authController.me,
);

export const authRoute = router;
