
import express from "express"
import { UserController } from "../controller/user-controller";
import { ThreadController } from "../controller/thread-controller";

export const publicRouter = express.Router();

// users
publicRouter.post("/api/v1/users", UserController.register);
publicRouter.post("/api/v1/users/login", UserController.login);

// threads
publicRouter.get("/api/v1/threads/:threadId", ThreadController.get);
