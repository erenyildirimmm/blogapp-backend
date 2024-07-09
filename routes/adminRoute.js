import { Router } from "express";
import { getUsers } from "../controllers/admin.js";
import isSuperAdmin from "../middleware/isSuperAdmin.js";
import isAuth from "../middleware/is-auth.js";

const router = Router();

router.get("/users", isAuth, isSuperAdmin, getUsers);

export default router;
