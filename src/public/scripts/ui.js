const windowWidth = 600;
function showPopup(type) {
  document.querySelector(`.popup--${type}`).classList.add("popup--show");
  document.querySelector(".layer").classList.remove("closed");
}
function hidePopUp(hidePopUpButton) {
  const popup = hidePopUpButton.parentNode.parentNode;
  const type = popup.getAttribute("data-type-of-popup");
  document.querySelector(`.popup--${type}`).classList.remove("popup--show");
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
      message.date,
      chatData.senderAvatar
    );
    messagesContainer.append(messageElement);
  });
  scrollToBottom();
}
function createMessage(
  message,
  messageId,
  senderUsername,
  messageDate,
  avatarSrc
) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  const messageDateDiv = document.createElement("div");
  messageDateDiv.classList.add("message__date");
  messageDateDiv.textContent = getDate(messageDate);
  const messageContent = document.createElement("div");
  messageContent.classList.add("message__content");
  const messageContentText = document.createElement("div");
  messageContentText.textContent = message;
  messageContentText.classList.add("message__content__text");
  messageContentText.setAttribute("message-id", messageId);
  if (yourUsername !== senderUsername) {
    const messageContentAvatar = document.createElement("div");
    messageContentAvatar.classList.add("message__content__avatar");
    if (avatarSrc === "") {
      messageContentAvatar.textContent = senderUsername.slice(0, 2);
    } else {
      messageContentAvatar.style.backgroundImage = `url('${avatarSrc}')`;
    }
    messageContent.appendChild(messageContentAvatar);
  } else {
    messageContentText.classList.add("message__content__text--current");
  }
  messageContent.appendChild(messageContentText);
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
    "maj",
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
function toggleSettings() {
  const settings = document.querySelector(".settings");
  settings.classList.toggle("settings--open");
}
function hideSettings(e) {
  const settings = e.target.closest(".settings");
  const avatar = e.target.closest(".app__header__avatar");
  if (settings || avatar) return;
  document.querySelector(".settings").classList.remove("settings--open");
}
function selectAvatar(e) {
  const avatar = e.target.closest(".avatar");
  if (!avatar) return;
  const selectedAvatars = document.querySelectorAll(".avatar--selected");
  selectedAvatars.forEach((selectedAvatar) =>
    selectedAvatar.classList.remove("avatar--selected")
  );
  avatar.classList.add("avatar--selected");
}
function generateDefaultAvatars(defaultAvatars) {
  const popupAvatars = document.querySelector(".popup__avatars");
  if (defaultAvatars) {
    defaultAvatars = JSON.parse(defaultAvatars);
    defaultAvatars.forEach((avatar) => {
      const avatarImg = document.createElement("img");
      avatarImg.classList.add("avatar", "avatar--select");
      avatarImg.style.backgroundImage = `URL("${avatar.src}")`;
      popupAvatars.appendChild(avatarImg);
    });
  }
}
function setYourAvatar(src) {
  const headerAvatar = document.querySelector(".app__header__avatar");
  headerAvatar.style.backgroundImage = src === "" ? "" : `URL("${src}")`;
  headerAvatar.textContent = src === "" ? yourUsername.slice(0, 2) : "";
}
function adjustAvatarsInChat(avatar, memberUsername) {
  const chatHeaderAvatar = document.querySelector(".chat__header__avatar");
  const contactActive = document.querySelector(".contact--active");
  const contactAvatar = contactActive.querySelector(".avatar");
  chatHeaderAvatar.style.backgroundImage = `url(${avatar})`;
  contactAvatar.style.backgroundImage = `url(${avatar})`;
  if (avatar === "") {
    chatHeaderAvatar.textContent = memberUsername.slice(0, 2);
    contactAvatar.textContent = memberUsername.slice(0, 2);
  } else {
    chatHeaderAvatar.textContent = "";
    contactAvatar.textContent = "";
  }
}
function adjustAvatarsInMessages(avatar, memberUsername) {
  const messageContentAvatars = document.querySelectorAll(
    ".message__content__avatar"
  );
  messageContentAvatars.forEach((messageAvatar) => {
    if (avatar === "") {
      messageAvatar.textContent = memberUsername.slice(0, 2);
      messageAvatar.style.backgroundImage = ``;
    } else {
      messageAvatar.textContent = "";
      messageAvatar.style.backgroundImage = `url(${avatar})`;
    }
  });
}
function setCorrectAvatarInAvatarsPopup() {
  const avatarsInPopup = document.querySelectorAll(".avatar--select");
  const headerAvatar = document.querySelector(".app__header__avatar");
  const headerAvatarUrl = headerAvatar.style.backgroundImage;
  avatarsInPopup.forEach((avatar) => {
    if (avatar.style.backgroundImage === headerAvatarUrl) {
      avatar.classList.add("avatar--selected");
    } else {
      avatar.classList.remove("avatar--selected");
    }
  });
}
async function openChat(contact) {
  const nameOfChat = contact.getAttribute("data-name-of-chat");
  const chatData = await getChatData(nameOfChat);
  if (!chatData) return;
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
function adjustToWindowSize() {
  const app = document.querySelector(".app");
  if (window.innerWidth < windowWidth) {
    app.classList.add("app--mobile");
  } else {
    app.classList.remove("app--mobile");
    app.classList.add("app--mobile--open");
  }
  const appHeaderAvatar = document.querySelector(".app__header__avatar");
  appHeaderAvatar.style.width = `${
    appHeaderAvatar.getBoundingClientRect().height
  }px`;
}

function initialize(avatar, defaultAvatarsToGenerate) {
  adjustToWindowSize();
  const contact = document.querySelector(".contact");
  const app = document.querySelector(".app");
  if (!contact) {
    app.classList.add("app--no-contacts");
  } else if (contact && window.innerWidth > windowWidth) {
    openChat(contact);
  }
  generateDefaultAvatars(defaultAvatarsToGenerate);
  setYourAvatar(avatar);
  setCorrectAvatarInAvatarsPopup();
}
