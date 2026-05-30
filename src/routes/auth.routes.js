
import {Router} from "express";
import passport from "passport";
import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import * as c from "../controllers/auth.js";

const r=Router();

r.post("/register",c.register);
r.post("/login",c.login);
r.post("/refresh",c.refresh);
r.get("/profile",auth,c.profile);
r.get("/admin",auth,role("admin"),c.admin);
r.post("/logout",c.logout);

r.get("/github",passport.authenticate("github",{scope:["user:email"]}));
r.get("/github/callback",
passport.authenticate("github",{failureRedirect:"/"}),
(req,res)=>res.redirect("/api/v1/auth/profile"));
r.get("/session", c.getSession);

export default r;
