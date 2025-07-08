import mongoose from "mongoose";
import messageSchema from "./messageSchema.mjs";
const chatSchema = mongoose.Schema({
  name: String,
  members: [String],
  messages: [messageSchema],
});
const Chat = mongoose.model("chat", chatSchema, "chats");
export default Chat;
