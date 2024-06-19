import { Router } from "express";
import { body } from "express-validator";
import { createComment, deleteComment, getComment } from "../controllers/comment.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.post(
  "/",
  isAuth,
  [body("content").trim().isLength({ max: 1500 }).notEmpty()],
  createComment
);

router.get("/:postId", getComment);

router.delete("/:id", isAuth, deleteComment);

export default router;