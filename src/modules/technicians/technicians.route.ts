import { Router } from "express";
import { techniciansController } from "./technicians.controller";

const router = Router();

router.get("/", techniciansController.getAllTechnicians);
router.get("/:id", techniciansController.getTechnicianById);

export const techniciansRoute = router;
