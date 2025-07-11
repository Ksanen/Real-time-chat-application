import { sendMessageToChat } from "../../controllers/chatControllers.mjs";
import User from "../../models/userSchema.mjs";

export default (socket, io) => {
  socket.on("newMessage", async (newMessage) => {
    try {
      if (typeof newMessage !== "string" || newMessage.length === 0) return;
      const userId = socket.request.session.passport.user;
      const user = await User.findById(userId);
      if (!user) return;
      const message = await sendMessageToChat(
        newMessage,
        socket.request.session.currentNameOfChat,
        user.username
      );
      io.to(socket.request.session.currentNameOfChat).emit("newMessage", {
        message: newMessage,
        messageId: String(message._id),
        senderUsername: user.username,
        date: message.date,
      });
    } catch (e) {
      console.log(e);
      return;
    }
  });
};
