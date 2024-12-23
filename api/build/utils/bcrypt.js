"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const hashPassword = (password) => {
    const salt = (0, bcrypt_1.genSaltSync)(10);
    return (0, bcrypt_1.hashSync)(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => {
    return (0, bcrypt_1.compareSync)(password, hashedPassword);
};
exports.comparePassword = comparePassword;
