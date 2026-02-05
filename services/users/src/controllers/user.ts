import { tryCatch } from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";

export const myProfile=tryCatch(async(req:AuthenticatedRequest,res,next)=>{
    const user= req.user;

    res.json(user);

    

})

export const  getUserProfile= tryCatch(async (req, res, next)=>{
    const {userId}= req.params;
    const users= await sql`
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
      WHERE u.user_id = ${userId}
      GROUP BY u.user_id;

    `
    if(users.length ===0){
        throw new ErrorHandler("User is not Found", 404);
    }

    const user= users[0]!;
    user.skills= user.skills || []


    res.json(user);
})


