
import session from "express-session";
import MongoStore from "connect-mongo";

export default session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
});
