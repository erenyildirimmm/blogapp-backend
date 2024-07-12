import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Like } from "../models/likeModel.js";
import { Comment } from "../models/commentModel.js";
import errorHandling from "../util/errors.js";

export const getUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).populate({
      path: "posts",
      populate: [
        {
          path: "category",
          model: "Category",
        },
        {
          path: "creator",
          model: "User",
          select: "fullName username", // Sadece creator'un ismini almak için
        },
      ],
    });
    if (!user) {
      const error = new Error("Kullanıcı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      userId: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      posts: user.posts,
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (req.userId != id) {
      res
        .status(400)
        .json({ message: "Size ait olmayan bir hesabı silemezsiniz." });
    }
    if (!user) {
      const error = new Error("Kullanıcı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }
    await Comment.deleteMany({ userId: id });
    await Like.deleteMany({ userId: id });
    await Post.deleteMany({ creator: id });

    await User.findByIdAndDelete(id);
    return res.status(200).send({ message: "User deleted succesfully" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};
