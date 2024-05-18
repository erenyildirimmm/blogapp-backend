import { User } from "../models/userModel.js";
import errorHandling from "../util/errors.js";

export const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "books",
      populate: [
        {
          path: "category",
          model: "Category",
        },
        {
          path: "creator",
          model: "User",
          select: "name", // Sadece creator'un ismini almak için
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
      name: user.name,
      email: user.email,
      status: user.status,
      books: user.books,
    });
  } catch (err) {
    errorHandling(err, req, res, next);
  }
};
