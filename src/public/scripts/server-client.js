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
  const activeContact = document.querySelector(".contact--active");
  const contactAvatar = activeContact.querySelector(".avatar");
  const chatHeaderUsernameDiv = document.querySelector(
    ".chat__header__username"
  );
  if (chatHeaderUsernameDiv.textContent !== username) return;
  if (yourUsername === username) return;
  console.log(yourUsername, username);
  const messageContentAvatars = document.querySelectorAll(
    ".message__content__avatar"
  );
  const chatHeaderAvatar = document.querySelector(".chat__header__avatar");

  messageContentAvatars.forEach((messageAvatar) => {
    if (avatar === "") {
      messageAvatar.textContent = username.slice(0, 2);
      messageAvatar.style.backgroundImage = ``;
    } else {
      messageAvatar.textContent = "";
      messageAvatar.style.backgroundImage = `url(${avatar})`;
    }
  });
  chatHeaderAvatar.style.backgroundImage = `url(${avatar})`;
  contactAvatar.style.backgroundImage = `url(${avatar})`;
  if (avatar === "") {
    contactAvatar.textContent = username.slice(0, 2);
    chatHeaderAvatar.textContent = username.slice(0, 2);
  } else {
    chatHeaderAvatar.textContent = "";
    contactAvatar.textContent = "";
  }
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
async function openChat(contact) {
  const nameOfChat = contact.getAttribute("data-name-of-chat");
  const response = await fetch("/app/openChat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameOfChat: nameOfChat }),
  });
  const chatData = await response.json();
  if (!chatData.success) return;
  const { senderAvatar } = chatData;
  socket.emit("join-room", nameOfChat);
  const memberUsername = contact.querySelector(
    ".contact__info__name"
  ).textContent;
  document.querySelector(".app").classList.add("app--mobile--open");
  document.querySelector(".chat__header__username").textContent =
    memberUsername;
  addMessages(chatData);
  setActiveContact(contact);
  adjustAvatarsInChat(senderAvatar, memberUsername);
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
