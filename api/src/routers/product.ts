import { Router } from "express";
import Product from "../models/product";

const ProductRouter = Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({}).select("-__v");
    res.json({
      success: true,
      message: "products fetched successfully",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
