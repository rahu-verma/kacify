"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModelName = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    image: {
        type: String,
        required: true,
        minlength: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: user_1.UserModelName,
        required: true,
    }
});
exports.ProductModelName = "Product";
const ProductModel = (0, mongoose_1.model)(exports.ProductModelName, schema);
ProductModel.syncIndexes();
exports.default = ProductModel;
