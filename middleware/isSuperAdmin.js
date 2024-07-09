import { User } from "../models/userModel.js";

export default async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    if (user.role !== "superadmin") {
      const error = new Error("Forbidden: Not a superadmin");
      error.status = 500;
      throw error;
    }
    next();
  } catch (err) {
     next(err);
  }
};
