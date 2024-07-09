import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import errorHandling from "../util/errors.js";
import dotenv from "dotenv";
import slug from "slug";
dotenv.config();

export const signup = async (req, res, next) => {
  const { email, fullName, username, password, socialMedia } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      fullName: fullName,
      username: username,
      socialMedia: socialMedia,
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const signin = async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  let loadedUser;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
      username: loadedUser.username,
      user: loadedUser,
      role: loadedUser.role
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const checkUsername = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.json(false);
  }
  return res.json(true);
};
