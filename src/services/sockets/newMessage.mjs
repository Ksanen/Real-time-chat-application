import { sendMessageToChat } from "../../controllers/chatControllers.mjs";
import User from "../../models/userSchema.mjs";

export default (socket, io) => {
  socket.on("newMessage", async (message) => {
    try {
      const userId = socket.request.session.passport.user;
      const user = await User.findById(userId);
      if (!user) return;
      if (typeof message !== "string" || message.length === 0) return;
      const messageId = await sendMessageToChat(
        message,
        socket.request.session.currentNameOfChat,
        user.username
      );
      io.to(socket.request.session.currentNameOfChat).emit("newMessage", {
        message: message,
        messageId: messageId,
        senderUsername: user.username,
      });
    } catch (e) {
      console.log(e);
      return;
    }
  });
};
