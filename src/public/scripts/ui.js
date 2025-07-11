const windowWidth = 600;

function showPopup() {
  document.querySelector(".popup").classList.add("popup--show");
  document.querySelector(".layer").classList.remove("closed");
}
function hidePopUp() {
  document.querySelector(".popup").classList.remove("popup--show");
  document.querySelector(".layer").classList.add("closed");
  document.querySelector(".popup__info__code").value = "";
  clearErrorMessage();
}
function clearErrorMessage() {
  document.querySelector(".popup__error").textContent = "";
}
function showErrorMessage(error) {
  document.querySelector(".popup__error").textContent = error;
}
function setActiveContact(contact) {
  disactivateContacts();
  contact.classList.add("contact--active");
}
function disactivateContacts() {
  const activeContacts = document.querySelectorAll(".contact--active");
  activeContacts.forEach((activeContact) => {
    activeContact.classList.remove("contact--active");
  });
}
function scrollToBottom() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const chatContent = document.querySelector(".chat__content");
      chatContent.scrollTop = chatContent.scrollHeight;
    });
  });
}
function addMessages(chatData) {
  const messages = chatData.chat.messages;
  const messagesContainer = document.querySelector(".chat__content");
  messagesContainer.textContent = "";
  messages.forEach((message, index) => {
    let messageElement = createMessage(
      message.content,
      String(chatData.chat.messages[index]._id),
      message.senderUsername,
      message.date
    );
    messagesContainer.append(messageElement);
  });
  scrollToBottom();
}
function createMessage(message, messageId, senderUsername, messageDate) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  const messageDateDiv = document.createElement("div");
  messageDateDiv.classList.add("message__date");
  messageDateDiv.textContent = getDate(messageDate);

  const messageContent = document.createElement("div");
  messageContent.textContent = message;
  messageContent.classList.add("message__content");
  messageContent.setAttribute("message-id", messageId);
  if (username === senderUsername) {
    messageContent.classList.add("message__content--current");
  }
  messageDiv.appendChild(messageDateDiv);
  messageDiv.appendChild(messageContent);
  return messageDiv;
}
function getDate(messageDate) {
  //dateMessage: 13 lis 2024 o 22:19
  let dateMessage = "";
  const monthsPolish = [
    "sty",
    "lut",
    "mar",
    "kwi",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paź",
    "lis",
    "gru",
  ];
  const date = new Date(parseInt(messageDate));
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate().toString().padStart(2, `0`);
  const hour = date.getHours().toString().padStart(2, `0`);
  const minute = date.getMinutes().toString().padStart(2, `0`);
  const currentDate = new Date();
  const currentDay = currentDate.getDate().toString().padStart(2, `0`);
  const currentYear = currentDate.getFullYear();
  if (currentDay !== day) {
    dateMessage += `${day} ${monthsPolish[month]} `;
  }
  if (currentYear !== year) {
    dateMessage += year + " ";
  }
  dateMessage += `o ${hour}:${minute}`;
  return dateMessage;
}
function returnToContacts() {
  document.querySelector(".app").classList.remove("app--mobile--open");
  disactivateContacts();
}
function showDateOfMessage(e) {
  const messageContent = e.target.closest(".message__content");
  if (!messageContent) return;
  hideDateOfMessages();
  const messageDate = messageContent.parentNode.querySelector(".message__date");
  messageDate.classList.add("message__date--show");
}
function hideDateOfMessages() {
  const activeMessagesDate = document.querySelectorAll(".message__date--show");
  activeMessagesDate.forEach((messageDate) => {
    messageDate.classList.remove("message__date--show");
  });
}
function adjustClassesToWindowSize() {
  const app = document.querySelector(".app");
  if (window.innerWidth < windowWidth) {
    app.classList.add("app--mobile");
  } else {
    app.classList.remove("app--mobile");
    app.classList.add("app--mobile--open");
  }
}
function initialize() {
  adjustClassesToWindowSize();
  const contact = document.querySelector(".contact");
  const app = document.querySelector(".app");
  if (!contact) {
    app.classList.add("app--no-contacts");
  } else if (contact && window.innerWidth > windowWidth) {
    openChat(contact);
  }
}
initialize();
