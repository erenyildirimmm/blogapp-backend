import { User } from "../models/userModel.js";
import errorHandling from "../util/errors.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("posts");
    const totalUser = await User.countDocuments();
    const usersWithPostCounts = users.map((user) => ({
      ...user.toObject(),
      postCount: user.posts.length,
    }));
    return res.status(200).json({
      totalUser: totalUser,
      users: usersWithPostCounts,
    });
  } catch (error) {
    errorHandling(req, res, next, error);
  }
};
