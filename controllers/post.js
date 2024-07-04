import { validationResult } from "express-validator";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Category } from "../models/categoryModel.js";
import errorHandling from "../util/errors.js";
import clearImage from "../util/clearImage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1 } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search != "all") {
      filter.title = { $regex: String(search), $options: "i" }; // Başlıkta arama
    }
    if (category != "all") {
      filter.category = category; // Kategori ile filtreleme
    }
    const posts = await Post.find(filter)
      .populate({
        path: "creator",
        select: "name",
      })
      .populate("commentsCount")
      .populate("likesCount")
      .populate("category")
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments();

    return res.status(200).json({
      total: total,
      data: posts,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const getRelatedPosts = async (req, res, next) => {
  const { category, limit } = req.query;
  const { id } = req.params;
  try {
    const { ObjectId } = mongoose.Types;
    const postId = new ObjectId(id);
    const categoryObjectId = new ObjectId(category);
    const posts = await Post.find({
      _id: { $ne: postId }, // Mevcut postu hariç tut
      category: categoryObjectId, // Belirtilen kategoriye ait olanlar
    })
      .populate({
        path: "creator",
        select: "name",
      })
      .limit(parseInt(limit));
    return res.status(200).json({ data: posts });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .populate({
        path: "creator",
        select: "name",
      })
      .populate("category")
      .populate("commentsCount")
      .populate("likesCount");

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Lütfen tüm alanları doğru bir şekilde doldurduğunuzdan ve boş alan bırakmadığınızdan emin olun"
      );
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("Lütfen bir resim seçtiğinizden emin olun");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: imageUrl,
      entryHeadline: req.body.entryHeadline,
      category: req.body.category,
      creator: req.userId,
    });

    const post = await newPost.save();

    const user = await User.findById(req.userId);
    user.posts.push(newPost);
    const creator = await user.save();
    return res.status(201).json({
      message: "Gönderi başarılı bir şekilde oluşturuldu",
      data: post,
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const updatedPost = async (req, res, next) => {
  const { id } = req.params;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect");
      error.statusCode = 404;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    const entryHeadline = req.body.entryHeadline;
    const category = req.body.category;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.entryHeadline = entryHeadline;
    post.category = category;

    const result = post.save();

    return res
      .status(200)
      .send({ message: "Post updated succesfully", updatedPost: result });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories: categories, count: categories.length });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(id);
    const user = await User.findById(req.userId);
    await user.posts.pull(id);
    await user.save();
    return res.status(200).send({ message: "Post deleted succesfully" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};
