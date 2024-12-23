import { Router } from "express";
import { z } from "zod";
import {
  authHandler,
  permissionHandler,
  roleHandler,
} from "../middlewares/auth";
import { requestBodyValidationHandler } from "../middlewares/validation";
import ProductModel from "../models/product";
import { sendProductsEmail } from "../utils/nodemailer";
import {
  AddProductRequestBodySchema,
  EditProductRequestBodySchema,
} from "../utils/zod";
import { UserType } from "../utils/types";

const ProductRouter = Router();

ProductRouter.get("/list", async (req, res, next) => {
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
  async (req, res, next) => {
    try {
      const user = req.user as UserType;
      const products = await ProductModel.find({
        user: user._id,
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
  async (req, res, next) => {
    try {
      const user = req.user as UserType;

      const { name, price, description, image } = req.body as z.infer<
        typeof AddProductRequestBodySchema
      >;

      await ProductModel.create({
        name,
        price,
        description,
        image,
        user: user._id,
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
  async (req, res, next) => {
    try {
      const user = req.user as UserType;

      const products = await ProductModel.find({ user: user._id });

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
  async (req, res, next) => {
    try {
      const user = req.user as UserType;

      const { productId } = req.params;

      await ProductModel.deleteOne({
        _id: productId,
        user: user._id,
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
  async (req, res, next) => {
    try {
      const user = req.user as UserType;

      const { name, price, description, image } = req.body as z.infer<
        typeof EditProductRequestBodySchema
      >;
      const { productId } = req.params;

      const product = await ProductModel.findOne({
        _id: productId,
        user: user._id,
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
