import Chat from "../models/chatSchema.mjs";
import User from "../models/userSchema.mjs";
export async function createChat(creatorId, codeOfSecondMember) {
  try {
    const creator = await User.findById(creatorId);
    const secondMember = await User.findOne({ code: codeOfSecondMember });
    if (!creator) {
      return {
        success: false,
        error: "creator not found",
      };
    }
    if (!secondMember) {
      return {
        success: false,
        error: "incorrect code",
      };
    }
    const creatorCode = creator.code;
    if (codeOfSecondMember === creatorCode) {
      return {
        success: false,
        error: "code cannot be the same as your code",
      };
    }
    const chatName1 = `${creatorCode}${codeOfSecondMember}`;
    const chatName2 = `${codeOfSecondMember}${creatorCode}`;
    const chatExists = await Chat.exists({
      name: { $in: [chatName1, chatName2] },
    });

    if (chatExists) {
      return {
        success: false,
        error: "chat exists",
      };
    } else {
      const nameOfChat = String(creatorCode) + String(codeOfSecondMember);
      const chat = Chat.create({
        name: nameOfChat,
        messages: [],
        members: [String(creator._id), String(secondMember._id)],
      });
      creator.chats.push(nameOfChat);
      secondMember.chats.push(nameOfChat);
      await creator.save();
      await secondMember.save();
      return true;
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error",
    };
  }
}
export async function getChatInfo(nameOfChat, userId) {
  try {
    let chat = await Chat.findOne({ name: nameOfChat }, { _id: 0, __v: 0 });
    if (!chat) return false;
    const userIsMemberOfChat = chat.members.find((member) => member === userId);
    if (!userIsMemberOfChat) return false;

    return chat;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function sendMessageToChat(
  messageContent,
  nameOfChat,
  senderUsername
) {
  try {
    const chat = await Chat.findOne({ name: nameOfChat });
    if (!chat) return false;
    const messageToSend = {
      content: messageContent,
      date: Date.now(),
      senderUsername: senderUsername,
    };
    chat.messages.push(messageToSend);
    await chat.save();
    const message = String(chat.messages[chat.messages.length - 1]);
    return message;
  } catch (e) {
    console.log(e);
    return false;
  }
}
