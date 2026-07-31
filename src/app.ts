import express, { type Application } from "express";
import prisma from "./lib/prisma";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";

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

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
