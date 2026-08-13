import express, { type Application } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { adminRoute } from "./modules/admin/admin.route";
import { bookingRoute } from "./modules/booking/booking.route";
import { serviceRoute } from "./modules/service/service.route";
import { categoryRoute } from "./modules/category/category.route";
import { techniciansRoute } from "./modules/technicians/technicians.route";
import { technicianRoute } from "./modules/technician/technician.route";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth/", authRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/bookings/", bookingRoute);
app.use("/api/services/", serviceRoute);
app.use("/api/categories/", categoryRoute);
app.use("/api/technicians/", techniciansRoute);
app.use("/api/technician/", technicianRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
