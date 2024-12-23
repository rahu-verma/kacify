"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const product_1 = __importDefault(require("../models/product"));
const nodemailer_1 = require("../utils/nodemailer");
const zod_1 = require("../utils/zod");
const ProductRouter = (0, express_1.Router)();
ProductRouter.get("/list", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find({}).select("-__v");
        res.json({
            success: true,
            data: products,
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
ProductRouter.get("/vendor", auth_1.authHandler, (0, auth_1.roleHandler)(["vendor"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const products = yield product_1.default.find({
            user: user._id,
        }).select("-__v");
        res.json({
            success: true,
            data: products,
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
ProductRouter.post("/", (0, validation_1.requestBodyValidationHandler)(zod_1.AddProductRequestBodySchema), auth_1.authHandler, (0, auth_1.roleHandler)(["vendor"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, price, description, image } = req.body;
        yield product_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
}));
ProductRouter.post("/email", auth_1.authHandler, (0, auth_1.roleHandler)(["vendor"]), (0, auth_1.permissionHandler)(["product.email"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const products = yield product_1.default.find({ user: user._id });
        yield (0, nodemailer_1.sendProductsEmail)(req.user.email, products);
        res.json({
            success: true,
            message: "Email sent successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
ProductRouter.delete("/:productId", auth_1.authHandler, (0, auth_1.roleHandler)(["vendor"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { productId } = req.params;
        yield product_1.default.deleteOne({
            _id: productId,
            user: user._id,
        });
        res.json({
            success: true,
            message: "Product deleted successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
ProductRouter.put("/:productId", auth_1.authHandler, (0, auth_1.roleHandler)(["vendor"]), (0, validation_1.requestBodyValidationHandler)(zod_1.EditProductRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, price, description, image } = req.body;
        const { productId } = req.params;
        const product = yield product_1.default.findOne({
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
        yield product.updateOne({
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
    }
    catch (error) {
        next(error);
    }
}));
exports.default = ProductRouter;
