import multer, { diskStorage } from "multer";
import { v4 as uuid4 } from "uuid";

// For Blog Pic
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, uuid4() + "-" + file.originalname);
  },
});

// For Profile Pic
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, uuid4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadBlogImage = multer({
  storage: blogStorage,
  fileFilter: fileFilter,
}).single("image");
const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
}).single("image");

export { uploadBlogImage, uploadProfileImage };
