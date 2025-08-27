"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const thread_controller_1 = require("../controller/thread-controller");
exports.authenticatedRouter = express_1.default.Router();
exports.authenticatedRouter.use(auth_middleware_1.authMiddleware);
// users
exports.authenticatedRouter.get("/api/v1/users/current", user_controller_1.UserController.currentUser);
exports.authenticatedRouter.put("/api/v1/users/current", user_controller_1.UserController.update);
exports.authenticatedRouter.post("/api/v1/users/logout", user_controller_1.UserController.logout);
// threads
exports.authenticatedRouter.post("/api/v1/threads", thread_controller_1.ThreadController.create);
exports.authenticatedRouter.put("/api/v1/threads/:threadId", thread_controller_1.ThreadController.update);
exports.authenticatedRouter.delete("/api/v1/threads/:threadId", thread_controller_1.ThreadController.delete);
