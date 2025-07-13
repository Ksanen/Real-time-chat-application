import { Router } from "express";
import checkIfSessionIsActive from "../middlewares/checkIfSessionIsActive.mjs";
import { body, validationResult } from "express-validator";
import {
  createChat,
  getChatInfo,
  getContactsInfo,
} from "../controllers/chatControllers.mjs";
const router = Router();

router.get("/app", checkIfSessionIsActive, async (req, res) => {
  try {
    const contactsInfo = await getContactsInfo(req.user.id);
    return res.render("app", {
      username: req.user.username,
      code: req.user.code,
      contacts: contactsInfo,
    });
  } catch (e) {
    console.log("error");
  }
});

router.post("/app/openChat", checkIfSessionIsActive, async (req, res) => {
  try {
    const chatInfo = await getChatInfo(req.body.nameOfChat, req.user.id);
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
  checkIfSessionIsActive,
  body("code").notEmpty().withMessage("kod nie może być pusty"),
  async (req, res) => {
    try {
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
