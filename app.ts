
require("dotenv").config();
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./app/modules/routes/user.routes";
export const app = express();

// cookie Parser
app.use(cookieParser());
// body Parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
// Routes

app.use("/api/v1", userRouter);

// Test Route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Api Is working",
    success: true,
  });
});
