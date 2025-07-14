import Chat from "../models/chatSchema.mjs";
import Avatar from "../models/defaultAvatars.mjs";
import User from "../models/userSchema.mjs";

export const getDefaultAvatars = async () => {
  try {
    const defaultAvatars = await Avatar.find();
    if (!defaultAvatars) return false;
    const avatars = defaultAvatars.map((avatar) => ({
      id: String(avatar._id),
      src: avatar.src,
    }));
    return avatars;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export async function getContactsInfo(id) {
  try {
    const user = await User.findById(id);
    if (!user) return false;
    const chats = user.chats;
    let contacts = [];
    for (let i = 0; i < chats.length; i++) {
      const chat = await Chat.findOne({ name: chats[i] });
      if (!chat) return false;
      const idOfMember = chat.members.find((memberId) => memberId != id);
      const secondMember = await User.findById(idOfMember);
      const usernameOfMember = secondMember.username;
      const avatarSrcOfMember = secondMember.avatarSrc;
      const lastMessageObject = chat.messages[chat.messages.length - 1];
      let lastMessage, senderUsername;
      if (lastMessageObject) {
        lastMessage = lastMessageObject.content;
        senderUsername = lastMessageObject.senderUsername;
      }
      const contact = {
        username: usernameOfMember,
        nameOfChat: chat.name,
        lastMessage: lastMessage || false,
        senderUsername: senderUsername || false,
        avatarSrc: avatarSrcOfMember,
      };
      contacts.push(contact);
    }

    return contacts;
  } catch (e) {
    console.log(e);
    return false;
  }
}
