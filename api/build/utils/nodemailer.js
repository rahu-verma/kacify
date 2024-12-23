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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProductsEmail = exports.sendForgotPasswordEmail = exports.sendErrorEmail = exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = (0, nodemailer_1.createTransport)({
        host: String(process.env.EMAIL_HOST),
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: String(process.env.EMAIL_ADDRESS),
            pass: String(process.env.EMAIL_PASSWORD),
        },
    });
    yield transporter.sendMail({
        from: String(process.env.EMAIL_ADDRESS),
        to,
        subject,
        text,
    });
});
exports.sendEmail = sendEmail;
const sendErrorEmail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(process.env.EMAIL_ADDRESS, "Kacify API error", message);
});
exports.sendErrorEmail = sendErrorEmail;
const sendForgotPasswordEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(to, "Kacify change password link", `${process.env.FRONTEND_URL}/changePassword?token=${to}|${token}`);
});
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendProductsEmail = (to, products) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendEmail)(to, "Your products", products.map((p) => p.name).join(", "));
});
exports.sendProductsEmail = sendProductsEmail;
