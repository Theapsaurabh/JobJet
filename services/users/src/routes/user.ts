import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  addSkillToUser,
  applyForJob,
  deleteSkillFromUser,
  getAllApplications,
  getUserProfile,
  myProfile,
  updateProfilePic,
  updateProfileResume,
  updateUserProfile,
} from "../controllers/user.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.get("/me", isAuth, myProfile);
router.put("/profile/resume/:userId", isAuth, upload, updateProfileResume);
router.post("/skill/add", isAuth, addSkillToUser);
router.delete("/skill/delete", isAuth, deleteSkillFromUser);
router.post("/apply/job", isAuth, applyForJob);
router.get("/getallapplication", isAuth, getAllApplications);
router.put("/update/pic/:userId", isAuth, upload, updateProfilePic);
router.get("/:userId", isAuth, getUserProfile);
router.put("/update/:userId", isAuth, updateUserProfile);
export default router;
