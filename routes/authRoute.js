import { Router } from "express";
import { signin, signup } from "../controllers/auth.js";
import { body } from "express-validator";
import { User } from "../models/userModel.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-Mail address already exists");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

router.post('/signin', signin);

export default router;
