import { Router } from "express";
import ProductModel from "../models/product";

const ProductRouter = Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find({}).select("-__v");
    res.json({
      success: true,
      data: products,
    });
    return;
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
