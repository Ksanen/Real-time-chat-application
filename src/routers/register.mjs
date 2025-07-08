import { Router } from "express";
import { createUser } from "../controllers/userController.mjs";
import { checkSchema, validationResult } from "express-validator";
import userValidator from "../utils/userValidator.mjs";
const router = Router();
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", checkSchema(userValidator), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("register", {
      msg: result.array()[0].msg,
      registered: false,
    });
  }
  const { username, password } = req.body;
  const userCreated = await createUser(username, password);
  if (!userCreated) {
    return res.render("register", {
      msg: "użytkownik o takiej nazwie istnieje",
      registered: false,
    });
  }
  res.render("register", {
    msg: "pomyślnie utworzono użytkownika. Zostaniesz przekierowany na stronę logowania",
    registered: true,
  });
});
export default router;
