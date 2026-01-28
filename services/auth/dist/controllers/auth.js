import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const registerUser = tryCatch(async (req, res, next) => {
    // Registration logic here
    const { name, email, password, phoneNumber, role, bio } = req.body;
    if (!name || !email || !password || !phoneNumber || !role || !bio) {
        throw new ErrorHandler("All fields are required", 400);
    }
    const existingUser = await sql `SELECT user_id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
        throw new ErrorHandler("User with this email already exists", 409);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    let registerUser;
    if (role === "recruiter") {
        const [user] = await sql `INSERT INTO users (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}) RETURNING user_id, name, email, phone_number, role, created_at`;
        registerUser = user;
    }
    else if (role === "jobseeker") {
        const file = req.file;
        if (!file) {
            throw new ErrorHandler("Profile picture is required for jobseekers", 400);
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new ErrorHandler("Failed to generate buffer", 500);
        }
        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffet: fileBuffer });
        if (!fileBuffer) {
            throw new ErrorHandler("Failed to process profile picture", 400);
        }
        const [user] = await sql `
  INSERT INTO users (
    name,
    email,
    password,
    phone_number,
    role,
    bio,
    resume,
    resume_public_id
  )
  VALUES (
    ${name},
    ${email},
    ${hashPassword},
    ${phoneNumber},
    ${role},
    ${bio},
    ${data.url},
    ${data.public_id}
  )
  RETURNING
    user_id,
    name,
    email,
    phone_number,
    role,
    bio,
    resume,
    resume_public_id,
    created_at
`;
        registerUser = user;
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: registerUser?.user_id }, process.env.JWT_SECRET, { expiresIn: "15d" });
    res.json({
        user: registerUser,
        token,
    });
});
export const loginUser = tryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler("Email and Password are required", 400);
    }
    const user = await sql `
SELECT
  u.user_id,
  u.name,
  u.email,
  u.password,
  u.phone_number,
  u.role,
  u.bio,
  u.resume,
  u.profile_picture,
  u.subscription,
  COALESCE(
    ARRAY_AGG(s.skill_name) FILTER (WHERE s.skill_name IS NOT NULL),
    '{}'
  ) AS skills
FROM users u
LEFT JOIN user_skills us ON u.user_id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.skill_id
WHERE u.email = ${email}
GROUP BY u.user_id;
`;
    if (user?.length === 0) {
        throw new ErrorHandler("Invalid email or password", 401);
    }
    if (!user) {
        throw new ErrorHandler("Invalid email or password", 401);
    }
    const userData = user[0];
    const isPasswordValid = await bcrypt.compare(password, userData?.password);
    if (!isPasswordValid) {
        throw new ErrorHandler("Invalid email or password", 401);
    }
    if (userData) {
        userData.skills = userData.skills || [];
    }
    delete userData?.password;
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: userData?.user_id }, process.env.JWT_SECRET, { expiresIn: "15d" });
    res.json({
        message: "User logged in successfully",
        user: userData,
        token,
    });
});
//# sourceMappingURL=auth.js.map