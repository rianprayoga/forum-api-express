"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web = void 0;
const express_1 = __importDefault(require("express"));
const public_router_1 = require("../route/public-router");
const error_middleware_1 = require("../middleware/error-middleware");
const auth_router_1 = require("../route/auth-router");
exports.web = (0, express_1.default)();
exports.web.use(express_1.default.json());
exports.web.use(public_router_1.publicRouter);
exports.web.use(auth_router_1.authenticatedRouter);
exports.web.use(error_middleware_1.errorMiddleware);
