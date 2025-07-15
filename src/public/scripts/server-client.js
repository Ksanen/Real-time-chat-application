const socket = io();
const yourUsername = document
  .querySelector("[data-username]")
  .getAttribute("data-username");
socket.on("newMessage", ({ message, id, senderUsername, avatarSrc }) => {
  const messagesContainer = document.querySelector(".chat__content");
  messagesContainer.appendChild(
    createMessage(message, id, senderUsername, Date.now(), avatarSrc)
  );
  adjustLastMessage(message, senderUsername);
  scrollToBottom();
});
socket.on("changeAvatar", ({ avatar, username }) => {
  const chatHeaderUsernameDiv = document.querySelector(
    ".chat__header__username"
  );
  if (chatHeaderUsernameDiv.textContent !== username) return;
  if (yourUsername === username) return;
  const avatarDivs = [];
  const chatHeaderAvatar = document.querySelector(".chat__header__avatar");
  const contactActive = document.querySelector(".contact--active");
  const contactAvatar = contactActive.querySelector(".avatar");
  const messageContentAvatars = document.querySelectorAll(
    ".message__content__avatar"
  );
  avatarDivs.push(...messageContentAvatars);
  avatarDivs.push(chatHeaderAvatar);
  avatarDivs.push(contactAvatar);
  adjustAvatars(avatar, username, avatarDivs);
});
async function sendMessage() {
  const messageDiv = document.querySelector(".chat__footer__message");
  const message = messageDiv.value;
  messageDiv.value = "";
  socket.emit("newMessage", message);
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
