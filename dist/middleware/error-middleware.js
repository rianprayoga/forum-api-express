"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const error_response_1 = require("../error/error-response");
const logging_1 = require("../application/logging");
const errorMiddleware = async (error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        const messages = error.issues.map(x => x.message);
        res
            .status(400)
            .json({
            errors: messages
        });
    }
    else if (error instanceof error_response_1.ResponseError) {
        res.status(error.status).json({
            errors: [error.message]
        });
    }
    else {
        logging_1.logger.error(error);
        res.status(500).json({
            errors: [error.message]
        });
    }
};
exports.errorMiddleware = errorMiddleware;
