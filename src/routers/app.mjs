import { Router } from "express";
import { ExpressValidator, body, validationResult } from "express-validator";
import {
  createChat,
  getChatInfo,
  getContactsInfo,
  sendMessageToChat,
} from "../controllers/chatControllers.mjs";
const router = Router();

router.get("/app", async (req, res) => {
  if (!req.user) return res.redirect("/");
  const contactsInfo = await getContactsInfo(req.user.id);
  return res.render("app", {
    username: req.user.username,
    code: req.user.code,
    contacts: contactsInfo,
  });
});

router.post("/app/openChat", async (req, res) => {
  try {
    if (!req.user) return res.redirect("/");
    const chatInfo = await getChatInfo(
      req.body.nameOfChat,
      String(req.user.id)
    );
    if (!chatInfo) {
      return res.json({
        success: false,
      });
    }
    return res.json({
      success: true,
      chat: chatInfo,
    });
  } catch (e) {
    console.log(e);
    return res.json({ success: false });
  }
});
router.post(
  "/app/addChat",
  body("code").notEmpty().withMessage("kod nie może być pusty"),
  async (req, res) => {
    try {
      if (!req.user) return res.redirect("/");
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.json({ success: false, error: result.array()[0].msg });
      }
      const code = req.body.code;
      const createChatResult = await createChat(req.user.id, code);
      if (!createChatResult.status) {
        return res.json({ success: false, error: createChatResult.error });
      }
      return res.json({ success: true });
    } catch (e) {
      console.log(e);
      return res.json({ success: false });
    }
  }
);
export default router;
