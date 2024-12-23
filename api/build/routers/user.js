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
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const nodemailer_1 = require("../utils/nodemailer");
const zod_1 = require("../utils/zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const UserRouter = (0, express_1.Router)();
UserRouter.post("/register", (0, validation_1.requestBodyValidationHandler)(zod_1.RegisterRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        if (yield user_1.default.exists({ email })) {
            res.send({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        yield user_1.default.create({
            email,
            password: (0, bcrypt_1.hashPassword)(password),
            role,
        });
        res.send({
            success: true,
            message: "User registered successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.post("/login", (0, validation_1.requestBodyValidationHandler)(zod_1.LoginRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        const user = yield user_1.default.findOne({ email, role });
        if (!user || !(0, bcrypt_1.comparePassword)(password, user.password)) {
            res.send({
                success: false,
                message: "unauthorized",
            });
            return;
        }
        res.send({
            success: true,
            data: (0, jwt_1.encodeJwt)({ _id: user._id }),
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.get("/profile", auth_1.authHandler, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        res.send({
            success: true,
            data: {
                _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
            },
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.post("/forgotPassword", (0, validation_1.requestBodyValidationHandler)(zod_1.ForgotPasswordRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user || user.role !== "user") {
            res.send({
                success: false,
                message: "unauthorized",
            });
            return;
        }
        user.forgotPasswordToken = Math.floor(Math.random() * 1000000);
        yield user.save();
        yield (0, nodemailer_1.sendForgotPasswordEmail)(user.email, user.forgotPasswordToken);
        res.json({
            success: true,
            message: "Password reset link sent to your email",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.post("/changePassword", (0, validation_1.requestBodyValidationHandler)(zod_1.ChangePasswordRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, token } = req.body;
        const [email, forgotPasswordToken] = token.split("|");
        const user = yield user_1.default.findOne({ email });
        if (!user ||
            user.forgotPasswordToken !== parseInt(forgotPasswordToken) ||
            user.role !== "user") {
            res.send({
                success: false,
                message: "unauthorized",
            });
            return;
        }
        yield user.updateOne({ password: (0, bcrypt_1.hashPassword)(password) });
        res.send({
            success: true,
            message: "Password changed successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.get("/users", auth_1.authHandler, (0, auth_1.roleHandler)(["admin"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({}).select("_id email");
        res.send({
            success: true,
            data: users,
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.delete("/:userId", auth_1.authHandler, (0, auth_1.roleHandler)(["admin"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.send({
                success: false,
                message: "User not found",
            });
            return;
        }
        yield user.deleteOne();
        res.send({
            success: true,
            message: "User deleted",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.post("/cart", auth_1.authHandler, (0, auth_1.roleHandler)(["user"]), (0, validation_1.requestBodyValidationHandler)(zod_1.AddToCartRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;
        yield user.updateOne({
            $push: {
                cart: {
                    product: productId,
                    quantity,
                },
            },
        });
        res.send({
            success: true,
            message: "Product added to cart",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.get("/all", auth_1.authHandler, (0, auth_1.roleHandler)(["admin"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({
            success: true,
            data: yield user_1.default.find({
                role: { $ne: "admin" },
            }).select("_id email role"),
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.post("/", auth_1.authHandler, (0, auth_1.roleHandler)(["admin"]), (0, validation_1.requestBodyValidationHandler)(zod_1.AddUserRequestBodySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role, password } = req.body;
        yield user_1.default.create({
            email,
            role,
            password: (0, bcrypt_1.hashPassword)(password),
        });
        res.send({
            success: true,
            message: "User added successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.get("/cart", auth_1.authHandler, (0, auth_1.roleHandler)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user = yield req.user.populate("cart.product");
        res.send({
            success: true,
            data: req.user.cart,
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.put("/cart/:productId/:quantity", auth_1.authHandler, (0, auth_1.roleHandler)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.params.quantity);
        yield user_1.default.findOneAndUpdate({
            _id: req.user._id,
            "cart.product": productId,
        }, {
            $set: {
                "cart.$.quantity": quantity,
            },
        });
        res.json({
            success: true,
            message: "Cart updated",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.delete("/cart/:productId", auth_1.authHandler, (0, auth_1.roleHandler)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        yield req.user.updateOne({
            $pull: {
                cart: {
                    product: productId,
                },
            },
        });
        res.json({
            success: true,
            message: "Product removed from cart",
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
UserRouter.get("/checkout", auth_1.authHandler, (0, auth_1.roleHandler)(["user"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user = yield req.user.populate("cart.product");
        const totalAmount = req.user.cart.reduce((acc, cartItem) => acc + cartItem.product.price * cartItem.quantity, 0);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: process.env.STRIPE_CURRENCY,
        });
        res.json({
            success: true,
            data: {
                cart: req.user.cart,
                clientSecret: paymentIntent.client_secret,
            },
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
exports.default = UserRouter;
