import { tryCatch } from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export const myProfile=tryCatch(async(req:AuthenticatedRequest,res,next)=>{
    const user= req.user;

    res.json(user);

    

})

