import mongoose from "mongoose";

const avatarSchema = mongoose.Schema({
  src: String,
});
const Avatar = mongoose.model("defaultAvatar", avatarSchema, "defaultAvatars");
export default Avatar;
