import { Router } from "express";
import { checkSchema } from "express-validator";
import userValidator from "../utils/userValidator.mjs";
import registerRouter from "./register.mjs";
import appRouter from "./app.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import handleLoginValidationResult from "../middlewares/handleLoginValidationResults.mjs";
const router = Router();

router.use(registerRouter);
router.use(appRouter);
router.get("/", (req, res) => {
  res.render("logIn");
});

router.post(
  "/",
  checkSchema(userValidator),
  handleLoginValidationResult,
  function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.render("logIn", { msg: "logowanie nie powiodło się" });
      }
      if (!user) {
        return res.render("logIn", { msg: info.msg });
      }
      req.login(user, (err) => {
        if (err) {
          return res.render("logIn", { msg: "błąd logowania" });
        }
        return res.redirect("/app");
      });
    })(req, res, next);
  }
);
router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
export default router;
