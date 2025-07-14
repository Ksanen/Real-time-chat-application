import User from "../models/userSchema.mjs";
import bcrypt from "bcrypt";
export const createUser = async function (username, password) {
  try {
    const userExists = await User.findOne({ username: username });
    if (userExists) return false;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      password: hash,
      code: await generateUniqueCode(username),
      chats: [],
      avatarSrc: "",
    });
    return true;
  } catch (e) {
    console.error(e);
  }
};
export const verifyPassword = async function (username, password) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  } catch (e) {
    console.error(e);
    return false;
  }
};
export const generateUniqueCode = async function (username) {
  let uniqueCode = username;
  let number;
  do {
    for (let i = 0; i < 2; i++) {
      number = Math.floor(Math.random() * 999);
      uniqueCode += number;
    }
  } while (!User.findOne({ code: uniqueCode }));
  return uniqueCode;
};
export const changeAvatar = async (idUser, imgBase64) => {
  try {
    const user = await User.findById(idUser);
    if (!user)
      return {
        success: false,
        error: "user not found",
      };
    user.avatarSrc = imgBase64;
    await user.save();
    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error",
    };
  }
};
