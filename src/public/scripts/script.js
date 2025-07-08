const socket = io();
const username = document
  .querySelector("[data-username]")
  .getAttribute("data-username");

socket.on("newMessage", ({ message, id, senderUsername }) => {
  const messagesContainer = document.querySelector(".app__chat__content");
  messagesContainer.appendChild(createMessage(message, id, senderUsername));
  const contactInfoText = document
    .querySelector(".contact--active")
    .querySelector(".contact__info__text");
  const text = senderUsername === username ? `ty: ${message}` : `${message}`;
  contactInfoText.textContent = text;
  scrollToBottom();
});
async function sendMessage() {
  const messageDiv = document.querySelector(".app__chat__footer__message");
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
function createMessage(message, messageId, senderUsername) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.classList.add("app__chat__content__message");
  messageDiv.setAttribute("message-id", messageId);

  if (username === senderUsername) {
    messageDiv.classList.add("app__chat__content__message--current");
  }
  return messageDiv;
}
function showPopup() {
  document.querySelector(".popup").classList.add("popup--show");
  document.querySelector(".layer").classList.remove("closed");
}
function hidePopUp() {
  document.querySelector(".popup").classList.remove("popup--show");
  document.querySelector(".layer").classList.add("closed");
  document.querySelector(".popup__info__code").value = "";
}
function clearErrorMessage() {
  document.querySelector(".popup__error").textContent = "";
}
function showErrorMessage(error) {
  document.querySelector(".popup__error").textContent = error;
}
function setActiveContact(contact) {
  const activeContacts = document.querySelectorAll(".contact--active");
  activeContacts.forEach((activeContact) => {
    activeContact.classList.remove(".contact--active");
  });
  contact.classList.add("contact--active");
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
  socket.emit("join-room", nameOfChat);
  const secondMemberUsername = contact.querySelector(
    ".contact__info__name"
  ).textContent;
  const chatData = await response.json();
  if (chatData.success) {
    addMessages(chatData);
    document.querySelector(".app__chat__header").textContent =
      secondMemberUsername;
    setActiveContact(contact);
    document.querySelector(".app__chat").classList.remove("closed");
    document.querySelector(".app__info").classList.add("closed");
  }
}
function addMessages(chatData) {
  const messages = chatData.chat.messages;
  const messagesContainer = document.querySelector(".app__chat__content");
  messagesContainer.textContent = "";
  messages.forEach((message, index) => {
    let messageElement = createMessage(
      message.content,
      String(chatData.chat.messages[index]._id),
      message.senderUsername
    );
    messagesContainer.append(messageElement);
  });
  scrollToBottom();
}
function scrollToBottom() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const chatContent = document.querySelector(".app__chat__content");
      chatContent.scrollTop = chatContent.scrollHeight;
    });
  });
}

function closeChat() {
  document.querySelector(".app__chat").classList.add("closed");
  document.querySelector(".app__info").classList.remove("closed");
}
document
  .querySelector(".app__chat__footer__send")
  .addEventListener("click", sendMessage);

document
  .querySelector(".app__menu__add-contact")
  .addEventListener("click", showPopup);
document.querySelector(".popup__btn--cancel").addEventListener("click", () => {
  hidePopUp();
  clearErrorMessage();
});
document.querySelector(".popup__btn--add").addEventListener("click", () => {
  if (!addChat()) hidePopUp();
});

document
  .querySelector(".app__menu__contacts")
  .addEventListener("click", (e) => {
    const contact = e.target.closest(".contact");
    if (contact) {
      openChat(contact);
    }
  });
