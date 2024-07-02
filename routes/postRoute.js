import { Router } from "express";
import { body } from "express-validator";
import {
  createPost,
  getPosts,
  getPost,
  updatedPost,
  deletePost,
  getCategory,
  getRelatedPosts,
} from "../controllers/post.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.post(
  "/",
  isAuth,
  [
    body("title").trim().notEmpty(),
    body("content").trim().isLength({ min: 10 }).notEmpty(),
    body("entryHeadline").trim().isLength({ min: 5 }).notEmpty(),
  ],
  createPost
);

router.get("/", getPosts);

router.get("/related/:id", getRelatedPosts);

router.get("/categories", isAuth, getCategory);

router.get("/:id", getPost);

router.put(
  "/:id",
  isAuth,
  [
    body("title").trim().notEmpty(),
    body("content").trim().isLength({ min: 100 }).notEmpty(),
    body("entryHeadline").trim().isLength({ min: 5 }).notEmpty(),
  ],
  updatedPost
);

router.delete("/:id", isAuth, deletePost);

export default router;
