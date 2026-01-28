import express from "express";
import { loginUser, registerUser } from "../controllers/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post("/register", upload, registerUser);
router.post("/login", loginUser);
export default router;
//# sourceMappingURL=auth.js.map