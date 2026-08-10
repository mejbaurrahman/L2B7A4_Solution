import express, { type Application } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";

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

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
