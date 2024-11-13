import cors from "cors";
import express from "express";
import ProductRouter from "./routers/product";
import env from "./utils/env";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));

app.get("/version", (req, res) => {
  res.send("1.0.0");
});

app.use("/product", ProductRouter);

export default app;
