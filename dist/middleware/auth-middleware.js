"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const database_1 = require("../application/database");
const authMiddleware = async (req, res, next) => {
    const token = req.get("X-API-TOKEN");
    if (token) {
        const authenticatedUser = await database_1.prismaClient.user.findFirst({
            where: {
                token: token
            }
        });
        if (authenticatedUser) {
            req.user = authenticatedUser;
            next();
            return;
        }
    }
    res
        .status(401)
        .json({
        errors: "Unathorized"
    })
        .end();
};
exports.authMiddleware = authMiddleware;
