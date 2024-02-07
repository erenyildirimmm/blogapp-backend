import { Router } from "express";
import { body } from "express-validator";
import {
  postBook,
  getBooks,
  getBook,
  updatedBook,
  deleteBook,
  getCategory,
} from "../controllers/book.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.post(
  "/",
  isAuth,
  [
    body("title").trim().notEmpty(),
    body("content").trim().isLength({ min: 100 }).notEmpty(),
    body("author").trim().isLength({ min: 5 }).notEmpty(),
  ],
  postBook
);

router.get("/", getBooks);

router.get("/categories", isAuth, getCategory);

router.get("/:id", isAuth, getBook);

router.put(
  "/:id",
  isAuth,
  [
    body("title").trim().notEmpty(),
    body("content").trim().isLength({ min: 100 }).notEmpty(),
    body("author").trim().isLength({ min: 5 }).notEmpty(),
  ],
  updatedBook
);

router.delete("/:id", isAuth, deleteBook);

export default router;
