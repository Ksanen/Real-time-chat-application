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
      message.senderUsername
    );
    messagesContainer.append(messageElement);
  });
  scrollToBottom();
}
function createMessage(message, messageId, senderUsername) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  const messageDate = document.createElement("div");
  messageDate.classList.add("message__date");
  messageDate.textContent = "Czw. o 21:40";

  const messageContent = document.createElement("div");
  messageContent.textContent = message;
  messageContent.classList.add("message__content");
  messageContent.setAttribute("message-id", messageId);
  if (username === senderUsername) {
    messageContent.classList.add("message__content--current");
  }
  messageDiv.appendChild(messageDate);
  messageDiv.appendChild(messageContent);
  return messageDiv;
}
function returnToContacts() {
  document.querySelector(".app").classList.remove("app--mobile--open");
  disactivateContacts();
}
function showDateOfMessage(e) {
  const message = e.target.closest(".message");
  if (!message) return;
  hideDateOfMessages();
  const messageDate = message.querySelector(".message__date");
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
