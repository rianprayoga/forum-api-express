"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user-controller");
const thread_controller_1 = require("../controller/thread-controller");
exports.publicRouter = express_1.default.Router();
// users
exports.publicRouter.post("/api/v1/users", user_controller_1.UserController.register);
exports.publicRouter.post("/api/v1/users/login", user_controller_1.UserController.login);
// threads
exports.publicRouter.get("/api/v1/threads/:threadId", thread_controller_1.ThreadController.get);
exports.publicRouter.get("/api/v1/threads", thread_controller_1.ThreadController.getPage);
