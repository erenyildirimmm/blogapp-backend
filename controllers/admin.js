import { User } from "../models/userModel.js"
import errorHandling from "../util/errors.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const totalUser = await User.countDocuments();
    return res.status(200).json({
      totalUser: totalUser,
      users: users
    })
  } catch(error) {
    errorHandling(req, res, next, error);
  }
}