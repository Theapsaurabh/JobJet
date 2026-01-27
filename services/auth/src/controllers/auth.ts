import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";

export const registerUser = tryCatch(async (req, res, next) => {
  // Registration logic here
  const { name, email, passwors, phoneNumber, role, bio } = req.body;
  if (!name || !email || !passwors || !phoneNumber || !role || !bio) {
    throw new ErrorHandler("All fields are required", 400);
  }
  const existingUser =
    await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    throw new ErrorHandler("User with this email already exists", 409);
  }
  const hashPassword = await bcrypt.hash(passwors, 10);
  let registerUser;
  if (role === "recruiter") {
    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}) RETURNING user_id, name, email, phone_number, role, created_at`;
    registerUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;
    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role, bio, profile_picture, profile_picture_public_id) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}, ${bio}, ${file?.path || null}, ${file?.filename || null}) RETURNING user_id, name, email, phone_number, role, bio, profile_picture, created_at`;
  }

  res.json(email);
});
