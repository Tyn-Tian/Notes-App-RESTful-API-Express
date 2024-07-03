import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import noteController from "../controller/note-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Note API
userRouter.post("/api/notes", noteController.create);
userRouter.get("/api/notes", noteController.getUnarchived);
userRouter.get("/api/notes/archived", noteController.getArchived);

export { userRouter };
