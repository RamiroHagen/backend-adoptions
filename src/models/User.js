
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email:{type:String,unique:true},
  password:String,
  role:{type:String,default:"user"},
  provider:{type:String,default:"local"},
  refreshToken:String
});

export default mongoose.model("User", userSchema);
