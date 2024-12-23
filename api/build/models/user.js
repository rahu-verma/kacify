"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelName = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
    },
    forgotPasswordToken: {
        type: Number,
        default: null,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "vendor"],
    },
    permissions: {
        type: [String],
        default: [],
    },
    cart: {
        type: [
            {
                product: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
            },
        ],
        default: [],
    },
    orders: {
        type: [
            {
                products: [
                    {
                        product: {
                            type: mongoose_1.Schema.Types.ObjectId,
                            ref: "Product",
                        },
                        quantity: Number,
                    },
                ],
                address: String,
                email: String,
            },
        ],
        default: [],
    },
});
exports.UserModelName = "User";
const UserModel = (0, mongoose_1.model)(exports.UserModelName, schema);
UserModel.syncIndexes();
exports.default = UserModel;
