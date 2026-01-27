import express from "express";
import { registerUser } from "../controllers/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post("/register", upload, registerUser);
export default router;
//# sourceMappingURL=auth.js.map