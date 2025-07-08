import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/userSchema.mjs";
import { verifyPassword } from "../controllers/userController.mjs";
passport.serializeUser((user, done) => {
  done(null, String(user.id));
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (e) {
    return done(e);
  }
});
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const usernameRegExp = new RegExp(`^` + username + `$`, `i`);
      const userExists = await User.findOne({
        username: usernameRegExp,
      });
      if (!userExists) {
        return done(null, false, { msg: "użytkownik nie istnieje" });
      }
      const passwordIsCorrect = await verifyPassword(usernameRegExp, password);
      if (!passwordIsCorrect) {
        return done(null, false, { msg: "niepoprawne hasło" });
      }
      return done(null, userExists);
    } catch (e) {
      console.error(e);
      done(e);
    }
  })
);
