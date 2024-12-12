import { Router } from "express";
import { errorCatcher } from "../middlewares/error";
import { serializeHandler } from "../middlewares/serializer";
import Product from "../models/product";
import { ProductRouterSerializerSchema } from "../utils/zod";

const ProductRouter = Router();

ProductRouter.get(
  "/",
  errorCatcher(async (req, res, next) => {
    const products = await Product.find({}).select("-__v");
    req.data = {
      products,
    };
    next();
  }),
  serializeHandler(ProductRouterSerializerSchema)
);

export default ProductRouter;
