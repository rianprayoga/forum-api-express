import express from "express"
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { ThreadController } from "../controller/thread-controller";

export const authenticatedRouter = express.Router();
authenticatedRouter.use(authMiddleware);

// users
authenticatedRouter.get("/api/v1/users/current", UserController.currentUser);
authenticatedRouter.put("/api/v1/users/current", UserController.update);
authenticatedRouter.post("/api/v1/users/logout", UserController.logout);

// threads
authenticatedRouter.post("/api/v1/threads", ThreadController.create);
authenticatedRouter.put("/api/v1/threads/:threadId", ThreadController.update);
authenticatedRouter.delete("/api/v1/threads/:threadId", ThreadController.delete);
