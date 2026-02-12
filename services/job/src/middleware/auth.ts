import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sql } from "../utils/db.js";

export interface AuthUser {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  role: "jobseeker" | "recruiter";
  bio: string | null;
  resume: string | null;
  resume_public_id: string | null;
  profile_picture: string | null;
  profile_picture_public_id: string | null;
  skills: string[];
  subscription: string | null;
}

export interface AuthenticatedRequest extends Request{
  user?:AuthUser
}

export const isAuth = async (
  req: AuthenticatedRequest ,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authorization header missing or invalid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Authorization token missing",
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const users = await sql`
      SELECT
        u.user_id,
        u.name,
        u.email,
        u.phone_number,
        u.role,
        u.bio,
        u.resume,
        u.resume_public_id,
        u.profile_picture,
        u.profile_picture_public_id,
        u.subscription,
        COALESCE(
          ARRAY_AGG(s.skill_name) FILTER (WHERE s.skill_name IS NOT NULL),
          '{}'
        ) AS skills
      FROM users u
      LEFT JOIN user_skills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE u.user_id = ${decoded.id}
      GROUP BY u.user_id;
    `;

    if (users.length === 0) {
      res.status(401).json({ message: "User associated with this token no longer exists." });
      return;
    }

    //  attach user to request
    req.user = users[0] as AuthUser;
    req.user.skills = req.user.skills || [];

    next(); 
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      message: "Authentication failed, Please login again",
    });
  }
};
