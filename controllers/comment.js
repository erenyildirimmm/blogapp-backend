import { validationResult } from "express-validator";
import errorHandling from "../util/errors.js";
import { Comment } from "../models/commentModel.js";
import { Post } from "../models/postModel.js";

export const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  const { userId, postId, content } = req.body;
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Boş bir yorum gönderemezsini.");
      error.statusCode = 422;
      throw error;
    }
    const newComment = new Comment({
      content,
      userId,
      postId,
    });
    const comment = await newComment.save();
    res.status(201).json({ message: "Yorum gönderildi.", data: comment });
  } catch (err) {
    errorHandling(err, res, req, next);
  }
};

export const getComment = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId: postId }).populate({
      path: "userId",
      select: "name",
    });
    return res.status(200).json(comments);
  } catch (error) {
    errorHandling(error, req, res, next);
  }
};

export const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }
    if (comment.userId.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    await Comment.findByIdAndDelete(id);
    return res.status(200).send({ message: "Comment deleted succesfully" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};
