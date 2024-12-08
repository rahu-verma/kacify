import cors from "cors";
import express from "express";
import ProductRouter from "./routers/product";
import UserRouter from "./routers/user";
import env from "./utils/env";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error";
import PermissionRouter from "./routers/permission";
import rateLimit from "express-rate-limit";
import { notFoundHandler } from "./middlewares/general";

const app = express();

app.use(rateLimit({ windowMs: 1000, limit: 2 }));
app.use(morgan("dev"));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/version", (req, res) => {
  res.json({
    success: true,
    message: "1.0.0",
    data: {},
  });
});

app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use("/permission", PermissionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
