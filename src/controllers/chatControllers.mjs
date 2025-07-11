import Chat from "../models/chatSchema.mjs";
import User from "../models/userSchema.mjs";
export async function createChat(creatorId, codeOfSecondMember) {
  try {
    const creator = await User.findById(creatorId);
    const secondMember = await User.findOne({ code: codeOfSecondMember });
    if (!creator) {
      return {
        status: false,
        error: "creator not found",
      };
    }
    if (!secondMember) {
      return {
        status: false,
        error: "incorrect code",
      };
    }
    const creatorCode = creator.code;
    if (codeOfSecondMember === creatorCode) {
      return {
        status: false,
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
        status: false,
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
      status: false,
      error: "error",
    };
  }
}

export async function getContactsInfo(id) {
  try {
    const user = await User.findById(id);
    if (!user) return false;
    const chats = user.chats;
    let contacts = [];
    for (let i = 0; i < chats.length; i++) {
      const chat = await Chat.findOne({ name: chats[i] });
      if (!chat) return false;
      const idOfSecondMember = chat.members.find((memberId) => memberId != id);
      const secondMember = await User.findById(idOfSecondMember);
      const usernameOfSecondMember = secondMember.username;
      const lastMessageObject = chat.messages[chat.messages.length - 1];
      let lastMessage, sender;
      if (lastMessageObject) {
        lastMessage = lastMessageObject.content;
        sender = lastMessageObject.senderUsername;
      }
      const contact = {
        username: usernameOfSecondMember,
        nameOfChat: chat.name,
        lastMessage: lastMessage || false,
        sender: sender || false,
      };
      contacts.push(contact);
    }

    return contacts;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export async function getChatInfo(nameOfChat, userId) {
  try {
    const chat = await Chat.findOne({ name: nameOfChat }, { _id: 0, __v: 0 });
    if (!chat) return false;
    const userIsMemberOfChat = chat.members.find((member) => member === userId);
    if (!userIsMemberOfChat) return false;
    return chat;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function sendMessageToChat(messageContent, nameOfChat, username) {
  try {
    const chat = await Chat.findOne({ name: nameOfChat });
    if (!chat) return false;
    const messageToSend = {
      content: messageContent,
      date: Date.now(),
      senderUsername: username,
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
