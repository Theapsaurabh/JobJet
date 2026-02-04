import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface User {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  role: "jobseeker" | "recruiter";
  bio: string | null;
  resume: string | null;
  resume_public_id: string | null;
  profile_pic: string | null;
  profile_pic_public_id: string | null;
  skills: string[];
  subscription: string | null;
}
export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authorization headers is missing or Invalid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
      return;
    }
    const decodedPayload = jwt.verify(token as string, jwtSecret) as JwtPayload;
    if(!decodedPayload || !decodedPayload.id){
        res.status(401).json({
            message:"Authorization header is missing or Invalid",
        });
        return;
    }
    



  } catch (error) {}
};
