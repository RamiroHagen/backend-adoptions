
export default (r)=>(req,res,next)=>{
  if(req.user.role!==r) return res.status(403).json({error:"No autorizado"});
  next();
};
