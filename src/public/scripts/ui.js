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
  const activeContacts = document.querySelectorAll(".contact--active");
  activeContacts.forEach((activeContact) => {
    activeContact.classList.remove("contact--active");
  });
  contact.classList.add("contact--active");
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
  messageDiv.textContent = message;
  messageDiv.classList.add("chat__content__message");
  messageDiv.setAttribute("message-id", messageId);
  if (username === senderUsername) {
    messageDiv.classList.add("chat__content__message--current");
  }
  return messageDiv;
}
function adjustClassesToWindowSize() {
  const appMenu = document.querySelector(".app__menu");
  const chat = document.querySelector(".chat");
  if (window.innerWidth < 600) {
    appMenu.classList.remove("app__menu--desktop");
    appMenu.classList.add("app__menu--mobile");
    chat.classList.add("chat--mobile");
  } else {
    appMenu.classList.add("app__menu--desktop");
    appMenu.classList.remove("app__menu--mobile");
    chat.classList.remove("chat--mobile");
  }
}
function initialize() {
  adjustClassesToWindowSize();
  const contact = document.querySelector(".contact");
  const appMenu = document.querySelector(".app__menu");
  appMenu.classList.add("app__menu--mobile--closed");
  if (contact && window.innerWidth > 600) {
    console.log(1);
    openChat(contact);
  }
}
initialize();
