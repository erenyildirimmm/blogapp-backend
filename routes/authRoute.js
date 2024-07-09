import { Router } from "express";
import { checkUsername, signin, signup } from "../controllers/auth.js";
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
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .custom((value) => {
        if (/\s/.test(value)) {
          throw new Error("Username should not contain spaces");
        }
        return true;
      })
      .custom(async (value) => {
        const userDoc = await User.findOne({ username: value });
        if (userDoc) {
          throw new Error("Username already exists");
        }
      }),
    body("password").trim().isLength({ min: 5 }),
    body("fullName").trim().not().isEmpty(),
  ],
  signup
);

router.post("/signin", signin);

router.post("/check-username", checkUsername);

export default router;
