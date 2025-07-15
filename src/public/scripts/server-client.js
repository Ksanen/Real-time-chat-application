const socket = io();
const yourUsername = document
  .querySelector("[data-username]")
  .getAttribute("data-username");
socket.on("newMessage", ({ message, id, senderUsername, avatarSrc }) => {
  const messagesContainer = document.querySelector(".chat__content");
  messagesContainer.appendChild(
    createMessage(message, id, senderUsername, Date.now(), avatarSrc)
  );
  const contactInfoText = document
    .querySelector(".contact--active")
    .querySelector(".contact__info__text");
  const text =
    senderUsername === yourUsername ? `ty: ${message}` : `${message}`;
  contactInfoText.textContent = text;
  scrollToBottom();
});
socket.on("changeAvatar", ({ avatar, username }) => {
  if (yourUsername === username) return;
  adjustAvatarsInMessages(avatar, username);
  adjustAvatarsInChat(avatar, username);
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
