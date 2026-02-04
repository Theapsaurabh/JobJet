import express from "express";
import { forgotPassword, loginUser, registerUser, resetPassword } from "../controllers/auth.js";
import upload from "../middleware/multer.js";
 

const router = express.Router();
router.post("/register", upload,registerUser);
router.post("/login", loginUser) ;
router.post("/forgot", forgotPassword);
router.post("/reset/:token",resetPassword )
export default router;

