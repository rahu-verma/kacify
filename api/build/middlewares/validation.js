"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestBodyValidationHandler = void 0;
const requestBodyValidationHandler = (schema) => {
    return (req, res, next) => {
        const parse = schema.safeParse(req.body);
        if (!parse.success) {
            res.status(400).json({
                success: false,
                message: JSON.stringify(parse.error.format()),
            });
            return;
        }
        req.body = parse.data;
        next();
    };
};
exports.requestBodyValidationHandler = requestBodyValidationHandler;
