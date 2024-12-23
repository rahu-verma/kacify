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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middlewares/error");
const general_1 = require("./middlewares/general");
const product_1 = __importDefault(require("./routers/product"));
const user_1 = __importDefault(require("./routers/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use("/product", product_1.default);
app.use("/user", user_1.default);
app.use(general_1.notFoundHandler);
app.use(error_1.errorHandler);
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const requiredEnvVariables = [
        "PORT",
        "MONGODB_URI",
        "CORS_ORIGIN",
        "JWT_SECRET",
        "EMAIL_HOST",
        "EMAIL_ADDRESS",
        "EMAIL_PASSWORD",
        "EMAIL_PORT",
        "FRONTEND_URL",
    ];
    for (const envVar of requiredEnvVariables) {
        if (!process.env[envVar]) {
            process.exit(1);
        }
    }
    yield mongoose_1.default.connect(process.env.MONGODB_URI, {
        autoIndex: true,
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
});
init();
