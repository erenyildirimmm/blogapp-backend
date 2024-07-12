import express from "express";
import mongoose from "mongoose";
import postRoute from "./routes/postRoute.js";
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import commentRoute from "./routes/commentRoute.js";
import likeRoute from "./routes/likeRoute.js";
import cors from "cors";
import { v4 as uuid4 } from "uuid";
import multer, { diskStorage } from "multer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return res.status(234).send("Welcome To MERN Stack Tutorial");
});

app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/users", userRoute);
app.use("/comments", commentRoute);
app.use("/likes", likeRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@atlascluster.br6pbyx.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
