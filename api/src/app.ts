import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import ProductRouter from "./routers/product";
import UserRouter from "./routers/user";
import { errorHandler } from "./middlewares/error";
import { notFoundHandler } from "./middlewares/general";
import AdminRouter from "./routers/admin";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use("/admin", AdminRouter);
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
