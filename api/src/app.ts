import cors from "cors";
import express from "express";
import ProductRouter from "./routers/product";
import UserRouter from "./routers/user";
import { errorHandler, versionRoute } from "./utils/common";
import env from "./utils/env";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/version", versionRoute);

app.use("/product", ProductRouter);
app.use("/user", UserRouter);

app.use(errorHandler);

export default app;
