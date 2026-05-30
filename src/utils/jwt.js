
import jwt from "jsonwebtoken";

export const genAccess = (u)=>jwt.sign({userId:u._id,role:u.role},process.env.JWT_SECRET,{expiresIn:"1h"});
export const genRefresh = (u)=>jwt.sign({userId:u._id},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"});
