
import jwt from "jsonwebtoken";
export default (req,res,next)=>{
  const t=req.cookies.authToken;
  if(!t) return res.status(401).json({error:"No auth"});
  try{req.user=jwt.verify(t,process.env.JWT_SECRET);next();}
  catch{return res.status(401).json({error:"Invalid"});}
};
