export default function checkIfSessionIsActive(req, res, next) {
  if (!req.user) return res.redirect("/");
  next();
}
