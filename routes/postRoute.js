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
import { uploadBlogImage } from "../middleware/multerConfig.js";

const router = Router();

router.post(
  "/",
  isAuth,
  uploadBlogImage,
  [
    body("title").trim().notEmpty(),
    body("content").trim().isLength({ min: 10 }).notEmpty(),
    body("entryHeadline").trim().isLength({ min: 5 }).notEmpty(),
  ],
  createPost
);

router.get("/related/:id", getRelatedPosts);

router.get("/categories", getCategory);

router.get("/detail/:slug", getPost);

router.get("/:category?/:search?/:page", getPosts);

router.put(
  "/:slug",
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
