import { Router } from "express";
import Product from "../models/product";
import { errorCatcher } from "../middlewares/error";

const ProductRouter = Router();

ProductRouter.get(
  "/",
  errorCatcher(async (req, res, next) => {
    const products = await Product.find({}).select("-__v");
    res.json({
      success: true,
      message: "products fetched successfully",
      code: "productsFetched",
      data: { products },
    });
  })
);

export default ProductRouter;
