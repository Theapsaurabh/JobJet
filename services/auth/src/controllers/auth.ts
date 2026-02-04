import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { tryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { forgotPasswordTemplate } from "../templete.js";
import { publishToTopic } from "../producer.js";

import { redisClient } from "../index.js";

dotenv.config();
// register controller
export const registerUser = tryCatch(async (req, res, next) => {
  // Registration logic here
  const { name, email, password, phoneNumber, role, bio } = req.body;
  if (!name || !email || !password || !phoneNumber || !role || !bio) {
    throw new ErrorHandler("All fields are required", 400);
  }
  const existingUser =
    await sql`SELECT user_id FROM users WHERE email = ${email}`;
  if (existingUser.length > 0) {
    throw new ErrorHandler("User with this email already exists", 409);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  let registerUser;
  if (role === "recruiter") {
    const [user] =
      await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}) RETURNING user_id, name, email, phone_number, role, created_at`;
    registerUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;

    if (!file) {
      throw new ErrorHandler("Profile picture is required for jobseekers", 400);
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ErrorHandler("Failed to generate buffer", 500);
    }

    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      { buffet: fileBuffer },
    );

    if (!fileBuffer) {
      throw new ErrorHandler("Failed to process profile picture", 400);
    }

    const [user] = await sql`
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

  const token = jwt.sign(
    { id: registerUser?.user_id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15d" },
  );
  res.json({
    user: registerUser,
    token,
  });
});
// login controller
export const loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorHandler("Email and Password are required", 400);
  }
  const user = await sql`
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
  const token = jwt.sign(
    { id: userData?.user_id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15d" },
  );
  res.json({
    message:"User logged in successfully",
    user: userData,
    token,
  });
});
// forgot password controller
export const forgotPassword = tryCatch(async (req, res, next) => {
  // Forgot password logic here
  const {email}=req.body;
  if(!email){
    throw new ErrorHandler("Email is required",400);
  }
  const user= await sql`SELECT user_id, name, email FROM users WHERE email=${email}`;
  if(user.length===0){
    return res.json({message:"If that email address is in our database, we will send you an email to reset your password."});
  }
  const userData = user[0];
  if (!userData) {
    return res.json({message:"If that email address is in our database, we will send you an email to reset your password."});
  }
  const resetToken = jwt.sign(
    {
      email: userData.email,
      type:"reset_password",
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" },
  );
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await redisClient.set(`forgot:${email}`, resetToken),{
    EX:900,
  }
  const message={
    to: userData.email,
    subject: "Password Reset Request",
    html:forgotPasswordTemplate(resetUrl),
    }
    publishToTopic("send-mail",[message]).catch((error)=>{
      console.log("failed to send message", error)
    });
  res.json({message:"If that email address is in our database, we will send you an email to reset your password."});
});


export const resetPassword = tryCatch(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw new ErrorHandler("Token is required", 400);
  }

  if (!password) {
    throw new ErrorHandler("Password is required", 400);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  let decoded: any;

  try {
    decoded = jwt.verify(token as string, process.env.JWT_SECRET);
  } catch (error) {
    throw new ErrorHandler("Expired or invalid token", 400);
  }

  // ✅ FIXED TOKEN TYPE CHECK
  if (decoded.type !== "reset_password") {
    throw new ErrorHandler("Invalid token type", 400);
  }

  const email = decoded.email;

  // 🔹 Redis validation (single-use token)
  const storedToken = await redisClient.get(`forgot:${email}`);

  if (!storedToken || storedToken !== token) {
    throw new ErrorHandler("Token is already used or expired", 400);
  }

  // 🔹 Check user
  const users = await sql`
    SELECT user_id FROM users WHERE email = ${email}
  `;

  if (users.length === 0) {
    throw new ErrorHandler("User not found", 404);
  }

  const user = users[0];

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  // 🔹 Update password
  const hashPassword = await bcrypt.hash(password, 10);

  await sql`
    UPDATE users
    SET password = ${hashPassword}
    WHERE user_id = ${user.user_id}
  `;

  // 🔹 Invalidate token
  await redisClient.del(`forgot:${email}`);

  res.json({
    message: "Password changed successfully",
  });
});
