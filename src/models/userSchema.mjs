import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  code: String,
  chats: [String],
});
const User = mongoose.model("user", userSchema, "users");
export default User;
