"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.encodeJwt = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const encodeJwt = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
exports.encodeJwt = encodeJwt;
const decodeJwt = (token) => {
    if ((0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET)) {
        return (0, jsonwebtoken_1.decode)(token);
    }
    return null;
};
exports.decodeJwt = decodeJwt;
