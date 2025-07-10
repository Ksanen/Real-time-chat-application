const socket = io();
const username = document
  .querySelector("[data-username]")
  .getAttribute("data-username");

socket.on("newMessage", ({ message, id, senderUsername }) => {
  const messagesContainer = document.querySelector(".chat__content");
  messagesContainer.appendChild(createMessage(message, id, senderUsername));
  const contactInfoText = document
    .querySelector(".contact--active")
    .querySelector(".contact__info__text");
  const text = senderUsername === username ? `ty: ${message}` : `${message}`;
  contactInfoText.textContent = text;
  scrollToBottom();
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
  if (!result) return false;
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
  socket.emit("join-room", nameOfChat);
  const secondMemberUsername = contact.querySelector(
    ".contact__info__name"
  ).textContent;
  addMessages(chatData);
  document.querySelector(".chat__header__username").textContent =
    secondMemberUsername;
  document.querySelector(".chat__header__avatar").textContent =
    secondMemberUsername.slice(0, 2);
  setActiveContact(contact);
  document.querySelector(".chat").classList.remove("closed");
  document.querySelector(".chat").classList.add("chat--mobile--open");
}
