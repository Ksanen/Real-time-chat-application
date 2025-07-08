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
