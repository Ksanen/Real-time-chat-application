const socket = io();
const yourUsername = document
  .querySelector("[data-username]")
  .getAttribute("data-username");
socket.on("newMessage", ({ message, id, senderUsername, avatarSrc }) => {
  const chatHeaderUsername = document.querySelector(
    ".chat__header__username"
  ).textContent;
  adjustLastMessage(message, senderUsername);
  if (chatHeaderUsername !== senderUsername && yourUsername !== senderUsername)
    return;
  const messagesContainer = document.querySelector(".chat__content");
  messagesContainer.appendChild(
    createMessage(message, id, senderUsername, Date.now(), avatarSrc)
  );
  scrollToBottom();
});
socket.on("changeAvatar", ({ avatar, username }) => {
  const chatHeaderUsernameDiv = document.querySelector(
    ".chat__header__username"
  );
  if (yourUsername === username) return;
  const avatarDivs = [];
  if (chatHeaderUsernameDiv.textContent === username) {
    const chatHeaderAvatar = document.querySelector(".chat__header__avatar");
    avatarDivs.push(chatHeaderAvatar);

    const messageContentAvatars = document.querySelectorAll(
      ".message__content__avatar"
    );
    avatarDivs.push(...messageContentAvatars);
  }
  const contactInfoNames = document.querySelectorAll(".contact__info__name");
  const contactInfoName = Array.from(contactInfoNames).filter(
    (name) => name.textContent === username
  )[0];
  const contact = contactInfoName.closest(".contact");
  const contactAvatar = contact.querySelector(".avatar");

  avatarDivs.push(contactAvatar);
  adjustAvatars(avatar, username, avatarDivs);
});
function joinAllRooms() {
  const dataNameOfChat = document.querySelectorAll("[data-name-of-chat]");
  const chatNames = [];
  dataNameOfChat.forEach((chat) => {
    chatNames.push(chat.getAttribute("data-name-of-chat"));
  });
  socket.emit("join-rooms", chatNames);
}
async function sendMessage() {
  const messageDiv = document.querySelector(".chat__footer__message");
  const message = messageDiv.value;
  const activeContact = document.querySelector(".contact--active");
  const nameOfChat = activeContact.getAttribute("data-name-of-chat");
  messageDiv.value = "";
  socket.emit("newMessage", {
    newMessage: message,
    nameOfChat: nameOfChat,
  });
}
async function addChat() {
  const code = document.querySelector(".popup__info__code").value;
  const response = await fetch("/app/addChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code }),
  });
  const result = await response.json();
  if (result.error) {
    showErrorMessage(result.error);
    return false;
  }
  location.reload();
  return true;
}
async function getChatData(nameOfChat) {
  const response = await fetch("/app/openChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameOfChat: nameOfChat }),
  });
  const chatData = await response.json();
  return chatData.success ? chatData : false;
}
async function changeAvatar() {
  try {
    const avatar = document.querySelector(".avatar--selected");
    const avatarUrl = avatar.style.backgroundImage;
    const avatarSrc = avatarUrl.slice(5, -2);
    const response = await fetch("/app/changeAvatar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: avatarSrc }),
    });
    const result = await response.json();
    if (!result) return alert("error");
    socket.emit("changeAvatar", {
      avatar: avatarSrc,
      username: yourUsername,
    });
    setYourAvatar(avatarSrc);
  } catch (e) {
    console.log(e);
  }
}
