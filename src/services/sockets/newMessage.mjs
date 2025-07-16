import { sendMessageToChat } from "../../controllers/chatControllers.mjs";
import User from "../../models/userSchema.mjs";

export default (socket, io) => {
  socket.on("newMessage", async ({ newMessage, nameOfChat }) => {
    try {
      if (typeof newMessage !== "string" || newMessage.length === 0) return;
      const userId = socket.request.session.passport.user;
      const user = await User.findById(userId);
      if (!user) return;
      const message = await sendMessageToChat(
        newMessage,
        nameOfChat,
        user.username
      );
      const messageToEmit = {
        message: newMessage,
        messageId: String(message._id),
        senderUsername: user.username,
        avatarSrc: user.avatarSrc,
        date: message.date,
      };
      io.to(nameOfChat).emit("newMessage", messageToEmit);
    } catch (e) {
      console.log(e);
      return;
    }
  });
};
