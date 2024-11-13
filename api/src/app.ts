import cors from "cors";
import express from "express";
import ProductRouter from "./routers/product";
import env from "./utils/env";
import UserRouter from "./routers/user";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/version", (req, res) => {
  res.send("1.0.0");
});

app.use("/product", ProductRouter);
app.use('/user', UserRouter);

export default app;
