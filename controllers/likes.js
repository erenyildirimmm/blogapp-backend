import { Like } from "../models/likeModel.js";
import errorHandling from "../util/errors.js";

export const addLike = async (req, res, next) => {
  const { userId, postId } = req.body;
  try {
    const newLike = new Like({ userId: userId, postId: postId });
    const like = newLike.save();
    return res.status(200).json({ message: "Like added", data: like });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const removeLike = async (req, res, next) => {
  const { userId, postId } = req.body;
  try {
    await Like.findOneAndDelete({ userId: userId, postId: postId });
    res.status(200).json({ message: "Like removed" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const isLiked = async (req, res, next) => {
  const { userId, postId } = req.query;
  try {
    const like = await Like.findOne({userId: userId, postId: postId});
    res.status(200).json({isLiked: like ? true : false});
  } catch(err) {
    errorHandling(err, req, res, next);
  }
}
