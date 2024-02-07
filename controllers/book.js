import { validationResult } from "express-validator";
import { Book } from "../models/bookModels.js";
import { User } from "../models/userModel.js";
import { Category } from "../models/categoryModel.js";
import errorHandling from "../util/errors.js";
import clearImage from "../util/clearImage.js";

export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .populate({
        path: "creator",
        select: "name",
      })
      .populate("category");

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const postBook = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Lürfen tüm alanları doğru bir şekilde doldurduğunuzdan ve boş alan bırakmadığınızdan emin olun"
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
    const newBook = new Book({
      title: req.body.title,
      content: req.body.content,
      imageUrl: imageUrl,
      author: req.body.author,
      category: req.body.category,
      creator: req.userId,
    });

    const book = await newBook.save();

    const user = await User.findById(req.userId);
    user.books.push(newBook);
    const creator = await user.save();
    return res
      .status(201)
      .json({ message: "Özet başarılı bir şekilde oluşturuldu", data: book });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};

export const updatedBook = async (req, res, next) => {
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
    const author = req.body.author;
    const category = req.body.category;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }
    if (!imageUrl) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }
    const book = await Book.findById(id);
    if (!book) {
      const error = new Error("Could not find book.");
      error.statusCode = 404;
      throw error;
    }
    if (book.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== book.imageUrl) {
      clearImage(book.imageUrl);
    }
    book.title = title;
    book.content = content;
    book.imageUrl = imageUrl;
    book.author = author;
    book.category = category;

    const result = book.save();

    return res
      .status(200)
      .send({ message: "Book updated succesfully", updatedBook: result });
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

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate("category");

    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const deleteBook = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      const error = new Error("Book not found");
      error.statusCode = 404;
      throw error;
    }
    if (book.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    clearImage(book.imageUrl);
    await Book.findByIdAndDelete(id);
    const user = await User.findById(req.userId);
    await user.books.pull(id);
    await user.save();
    return res.status(200).send({ message: "Book deleted succesfully" });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};
