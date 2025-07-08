import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  content: String,
  date: String,
  senderUsername: String,
});
export default messageSchema;
