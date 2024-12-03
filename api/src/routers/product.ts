import { Router } from "express";
import Product from "../models/product";
import User from "../models/user";
import mongoose from "mongoose";
import PermissionModel from "../models/permission";

const ProductRouter = Router();

ProductRouter.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({}).select("-__v");
    res.json({
      success: true,
      message: "products fetched successfully",
      code: "productsFetched",
      data: { products },
    });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;
