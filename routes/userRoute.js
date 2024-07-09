import { Router } from "express";
import { body } from "express-validator";
import {
  deleteUser,
  getUser,
} from "../controllers/user.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.get(
  "/:username",
  getUser
);

router.delete("/delete/:id",isAuth, deleteUser);


export default router;
