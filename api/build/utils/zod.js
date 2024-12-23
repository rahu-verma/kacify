"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPaymentIntentRequestBodySchema = exports.AddUserRequestBodySchema = exports.AddToCartRequestBodySchema = exports.EditProductRequestBodySchema = exports.AddProductRequestBodySchema = exports.ChangePasswordRequestBodySchema = exports.AdminRegisterRequestBodySchema = exports.ForgotPasswordRequestBodySchema = exports.LoginRequestBodySchema = exports.RegisterRequestBodySchema = void 0;
const validator_1 = require("validator");
const zod_1 = require("zod");
exports.RegisterRequestBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().refine(validator_1.isStrongPassword, {
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    role: zod_1.z
        .string()
        .min(1)
        .refine((role) => ["user", "vendor"].includes(role), {
        message: "Role must be either 'user' or 'vendor'",
    }),
});
exports.LoginRequestBodySchema = zod_1.z.object({
    email: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
    role: zod_1.z
        .string()
        .min(1)
        .refine((role) => ["user", "vendor", "admin"].includes(role), {
        message: "Role must be either 'user', 'vendor', or 'admin'",
    }),
});
exports.ForgotPasswordRequestBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.AdminRegisterRequestBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().refine(validator_1.isStrongPassword, {
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    adminRegisterToken: zod_1.z.string().min(1),
});
exports.ChangePasswordRequestBodySchema = zod_1.z.object({
    password: zod_1.z.string().refine(validator_1.isStrongPassword, {
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    token: zod_1.z.string().min(1),
});
exports.AddProductRequestBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    image: zod_1.z.string().min(1),
    price: zod_1.z.number().min(1),
    description: zod_1.z.string().min(1),
});
exports.EditProductRequestBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    image: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
});
exports.AddToCartRequestBodySchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    quantity: zod_1.z.number().min(1),
});
exports.AddUserRequestBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z
        .string()
        .min(1)
        .refine((role) => ["user", "vendor"].includes(role), {
        message: "Role must be either 'user' or 'vendor'",
    }),
    password: zod_1.z.string().refine(validator_1.isStrongPassword, {
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
exports.CheckoutPaymentIntentRequestBodySchema = zod_1.z.object({
    amount: zod_1.z.number().min(1),
});
