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
exports.permissionHandler = exports.roleHandler = exports.authHandler = void 0;
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = require("../utils/jwt");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.headers.authorization;
    if (!authToken) {
        res.send({
            success: false,
            message: "unauthorized",
        });
        return;
    }
    const decodedJwt = (0, jwt_1.decodeJwt)(authToken);
    const userId = decodedJwt["_id"];
    if (!userId) {
        res.send({
            success: false,
            message: "unauthorized",
        });
        return;
    }
    const user = yield user_1.default.findById(userId);
    if (!user) {
        res.send({
            success: false,
            message: "unauthorized",
        });
        return;
    }
    req.user = user;
    next();
});
exports.authHandler = authHandler;
const roleHandler = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!roles.includes(req.user.role)) {
        res.send({
            success: false,
            message: "unauthorized",
        });
        return;
    }
    next();
});
exports.roleHandler = roleHandler;
const permissionHandler = (permissions) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!permissions.every((permission) => req.user.permissions.includes(permission))) {
        res.send({
            success: false,
            message: "unauthorized",
        });
        return;
    }
    next();
});
exports.permissionHandler = permissionHandler;
