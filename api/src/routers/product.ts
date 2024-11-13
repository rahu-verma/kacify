import { Router } from "express";
import ProductModel from "../models/product";

const ProductRouter = Router();

ProductRouter.get("/", async (req, res) => {
  const products = await ProductModel.find({}).select("-__v");
  res.json(products);
});

export default ProductRouter;
