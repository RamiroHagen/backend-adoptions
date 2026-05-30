
import User from "../models/User.js";
import {hash,compare} from "../utils/hash.js";
import {genAccess,genRefresh} from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
  const {email,password}=req.body;
  if(await User.findOne({email})) return res.status(400).json({error:"exists"});
  await User.create({email,password:await hash(password)});
  res.json({msg:"ok"});
};

export const login=async(req,res)=>{
  const {email,password}=req.body;
  const u=await User.findOne({email});
  if(!u||!await compare(password,u.password)) return res.status(400).json({error:"bad"});
  const at=genAccess(u); const rt=genRefresh(u);
  u.refreshToken=rt; await u.save();
  res.cookie("authToken",at,{httpOnly:true});
  res.cookie("refreshToken",rt,{httpOnly:true});
  res.json({accessToken:at});
};

export const refresh=async(req,res)=>{
  const t=req.cookies.refreshToken;
  if(!t) return res.status(401).json({error:"no"});
  const d=jwt.verify(t,process.env.JWT_REFRESH_SECRET);
  const u=await User.findById(d.userId);
  if(!u||u.refreshToken!==t) return res.status(403).json({error:"bad"});
  const at=genAccess(u);
  res.cookie("authToken",at,{httpOnly:true});
  res.json({accessToken:at});
};

export const profile=(req,res)=>res.json(req.user);

export const admin=(req,res)=>res.json({msg:"admin ok"});

export const logout=async(req,res)=>{
  const t=req.cookies.refreshToken;
  if(t){
    const u=await User.findOne({refreshToken:t});
    if(u){u.refreshToken=null;await u.save();}
  }
  res.clearCookie("authToken");
  res.clearCookie("refreshToken");
  res.json({msg:"logout"});
};

export const getSession = (req, res) => {
  if (!req.session) {
    return res.status(401).json({
      error: "No hay sesión activa"
    });
  }

  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.user || null
  });
};