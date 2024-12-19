import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error";
import { notFoundHandler } from "./middlewares/general";
import ProductRouter from "./routers/product";
import UserRouter from "./routers/user";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "10mb" }));

app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const init = async () => {
  const requiredEnvVariables = [
    "PORT",
    "MONGODB_URI",
    "CORS_ORIGIN",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_ADDRESS",
    "EMAIL_PASSWORD",
    "EMAIL_PORT",
    "FRONTEND_URL",
  ];
  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      process.exit(1);
    }
  }
  await mongoose.connect(process.env.MONGODB_URI!, {
    autoIndex: true,
  });
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
};

init();
