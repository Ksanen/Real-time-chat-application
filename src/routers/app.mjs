import { Router } from "express";
import checkIfSessionIsActive from "../middlewares/checkIfSessionIsActive.mjs";
import { body, validationResult } from "express-validator";
import { createChat, getChatInfo } from "../controllers/chatControllers.mjs";
import { changeAvatar } from "../controllers/userController.mjs";
import {
  addDefaultAvatarsToDatabase,
  getContactsInfo,
  getDefaultAvatars,
} from "../controllers/controllers.mjs";
import User from "../models/userSchema.mjs";
const router = Router();

router.get("/app", checkIfSessionIsActive, async (req, res) => {
  try {
    const contactsInfo = await getContactsInfo(req.user.id);
    await addDefaultAvatarsToDatabase();
    const defaultAvatars = await getDefaultAvatars();
    return res.render("app", {
      username: req.user.username,
      code: req.user.code,
      contacts: contactsInfo,
      defaultAvatars: defaultAvatars,
      avatarSrc: req.user.avatarSrc,
    });
  } catch (e) {
    console.log("error");
    return res.status(500);
  }
});
router.put(
  "/app/changeAvatar",
  checkIfSessionIsActive,
  body("src").isString().withMessage("name of chat must be a string"),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: result.array(),
        });
      }
      const base64Img = req.body.src;
      const resultOfChanging = await changeAvatar(req.user.id, base64Img);
      if (!resultOfChanging.success) {
        return res.json({
          error: resultOfChanging.error || "unsuccessfull change of avatar",
        });
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
router.post(
  "/app/openChat",
  checkIfSessionIsActive,
  body("nameOfChat").isString().withMessage("name of chat must be a string"),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(400).json({
          success: false,
          errors: result.array(),
        });
      const chatInfo = await getChatInfo(req.body.nameOfChat, req.user.id);
      const senderId = chatInfo.members.find(
        (member) => member !== req.user.id
      );
      const sender = await User.findById(senderId);
      if (!chatInfo || !sender) {
        return res.status(404).json({
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
        chat: chatInfo,
        senderAvatar: sender.avatarSrc,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false });
    }
  }
);
router.post(
  "/app/addChat",
  checkIfSessionIsActive,
  body("code").notEmpty().withMessage("code cannot be empty"),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.json({ success: false, error: result.array()[0].msg });
      }
      const code = req.body.code;
      const createChatResult = await createChat(req.user.id, code);
      if (!createChatResult.success) {
        return res.json({ success: false, error: createChatResult.error });
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false });
    }
  }
);
export default router;
