import { Router } from "express";
import { body } from "express-validator";
import {
  getUser,
} from "../controllers/user.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.get(
  "/:id",
  getUser
);


export default router;
