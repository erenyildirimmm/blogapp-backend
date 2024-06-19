import { Router } from "express";
import { addLike, isLiked, removeLike } from "../controllers/likes.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.post('/add', isAuth, addLike);
router.post("/remove", isAuth, removeLike);
router.get("/isLiked", isAuth, isLiked);

export default router;