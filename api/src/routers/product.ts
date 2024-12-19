import { Router } from "express";
import ProductModel from "../models/product";
import { requestBodyValidationHandler } from "../middlewares/validation";
import {
  AddProductRequestBodySchema,
  EditProductRequestBodySchema,
} from "../utils/zod";
import {
  authHandler,
  permissionHandler,
  roleHandler,
} from "../middlewares/auth";
import { z } from "zod";
import { UserRequest } from "../utils/types";
import { sendProductsEmail } from "../utils/nodemailer";

const ProductRouter = Router();

ProductRouter.get("/list", async (req: UserRequest, res, next) => {
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

ProductRouter.get(
  "/vendor",
  authHandler,
  roleHandler(["vendor"]),
  async (req: UserRequest, res, next) => {
    try {
      const products = await ProductModel.find({
        user: req.user._id,
      }).select("-__v");
      res.json({
        success: true,
        data: products,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.post(
  "/",
  requestBodyValidationHandler(AddProductRequestBodySchema),
  authHandler,
  roleHandler(["vendor"]),
  async (req: UserRequest, res, next) => {
    try {
      const { name, price, description, image } = req.body as z.infer<
        typeof AddProductRequestBodySchema
      >;

      await ProductModel.create({
        name,
        price,
        description,
        image,
        user: req.user._id,
      });

      res.json({
        success: true,
        message: "Product added successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.post(
  "/email",
  authHandler,
  roleHandler(["vendor"]),
  permissionHandler(["product.email"]),
  async (req: UserRequest, res, next) => {
    try {
      const products = await ProductModel.find({ user: req.user._id });

      await sendProductsEmail(req.user.email, products);

      res.json({
        success: true,
        message: "Email sent successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.delete(
  "/:productId",
  authHandler,
  roleHandler(["vendor"]),
  async (req: UserRequest, res, next) => {
    try {
      const { productId } = req.params;

      await ProductModel.deleteOne({
        _id: productId,
        user: req.user._id,
      });

      res.json({
        success: true,
        message: "Product deleted successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.put(
  "/:productId",
  authHandler,
  roleHandler(["vendor"]),
  requestBodyValidationHandler(EditProductRequestBodySchema),
  async (req: UserRequest, res, next) => {
    try {
      const { name, price, description, image } = req.body as z.infer<
        typeof EditProductRequestBodySchema
      >;
      const { productId } = req.params;

      const product = await ProductModel.findOne({
        _id: productId,
        user: req.user._id,
      });
      if (!product) {
        res.json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      await product.updateOne({
        name,
        price,
        description,
        image,
      });

      res.json({
        success: true,
        message: "Product deleted successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
);

export default ProductRouter;
