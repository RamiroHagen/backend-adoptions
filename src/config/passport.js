
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

passport.serializeUser((user,done)=>done(null,user._id));
passport.deserializeUser(async(id,done)=>{
  const user=await User.findById(id);
  done(null,user);
});

passport.use(new GitHubStrategy({
  clientID:process.env.GITHUB_ID,
  clientSecret:process.env.GITHUB_SECRET,
  callbackURL:process.env.GITHUB_CALLBACK
},
async(accessToken,refreshToken,profile,done)=>{
  let email = profile.emails?.[0]?.value || profile.username+"@github.com";
  let user = await User.findOne({email});
  if(!user){
    user = await User.create({email,password:"oauth",provider:"github"});
  }
  done(null,user);
}));

export default passport;
