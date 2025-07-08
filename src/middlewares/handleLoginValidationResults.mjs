import { validationResult } from "express-validator";
export default function handleLoginValidationResult(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.render("logIn", {
      msg: result.array()[0].msg,
    });
  } else {
    next();
  }
}
