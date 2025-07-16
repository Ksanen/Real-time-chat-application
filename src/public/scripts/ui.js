const windowWidth = 600;
function showPopup(type) {
  document.querySelector(`.popup--${type}`).classList.add("popup--show");
  document.querySelector(".layer").classList.remove("closed");
}
function hidePopup(type) {
  document.querySelector(`.popup--${type}`).classList.remove("popup--show");
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
function selectAvatar(avatar) {
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
      const avatarImg = document.createElement("div");
      avatarImg.classList.add("avatar", "avatar--select");
      avatarImg.setAttribute("tabindex", "0");
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
/*
  avatarDiv - Wszystkie divy dla których chce się ustawić avatar
*/
function adjustAvatars(avatar, username, avatarDivs) {
  avatarDivs.forEach((div) => {
    div.style.backgroundImage = `url(${avatar})`;
    div.textContent = avatar === "" ? username.slice(0, 2) : "";
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
  const messages = chatData.chat.messages;
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1].content : false;
  const sender =
    messages.length > 0 ? messages[messages.length - 1].senderUsername : false;
  addMessages(chatData);
  scrollToBottom();
  setActiveContact(contact);
  adjustLastMessage(lastMessage, sender);
  const chatHeaderAvatar = document.querySelector(".chat__header__avatar");
  const contactActive = document.querySelector(".contact--active");
  const contactAvatar = contactActive.querySelector(".avatar");
  const avatarDivs = [];
  avatarDivs.push(chatHeaderAvatar);
  avatarDivs.push(contactAvatar);
  adjustAvatars(senderAvatar, memberUsername, avatarDivs);
}
function adjustLastMessage(message, senderUsername) {
  if (!message) return;
  const contactActive = document.querySelector(".contact--active");
  const contactInfoText = contactActive.querySelector(".contact__info__text");
  const text =
    senderUsername === yourUsername ? `ty: ${message}` : `${message}`;
  contactInfoText.textContent = text;
}
function adjustToWindowSize() {
  const app = document.querySelector(".app");
  if (window.innerWidth < windowWidth) {
    app.classList.add("app--mobile");
  } else {
    app.classList.remove("app--mobile");
    app.classList.add("app--mobile--open");
    activateAppropriateContact();
  }
  adjustAvatarSize();
}
function adjustAvatarSize() {
  const appHeaderAvatar = document.querySelector(".app__header__avatar");
  const height = appHeaderAvatar.getBoundingClientRect().height;
  appHeaderAvatar.style.width = `${height}px`;
}
function activateAppropriateContact() {
  /*
    Na małych ekranach jest możliwość, żeby żaden chat nie był otwarty,dlatego przy
    zwiększeniu rozmiaru ekranu trzeba z powrotem zaznaczyć odpowiedni kontakt
  */
  const chatHeaderUsername = document.querySelector(
    ".chat__header__username"
  ).textContent;
  const contacts = document.querySelectorAll(".contact");
  contacts.forEach((contact) => {
    const contactInfoName = contact.querySelector(
      ".contact__info__name"
    ).textContent;
    if (contactInfoName === chatHeaderUsername) {
      setActiveContact(contact);
    }
  });
}
function initialize(avatar, defaultAvatarsToGenerate) {
  adjustToWindowSize();
  generateDefaultAvatars(defaultAvatarsToGenerate);
  setYourAvatar(avatar);
  setCorrectAvatarInAvatarsPopup();
  const contact = document.querySelector(".contact");
  const app = document.querySelector(".app");
  if (!contact) {
    app.classList.add("app--no-contacts");
  } else if (contact && window.innerWidth > windowWidth) {
    openChat(contact);
  }
}
function popupOptionHandler(popupOptionBtn) {
  const option = popupOptionBtn.getAttribute("data-popup-btn-option");
  const popup = popupOptionBtn.parentNode.parentNode;
  const type = popup.getAttribute("data-type-of-popup");
  switch (option) {
    case "addContact":
      addChat();
      break;
    case "changeAvatar":
      changeAvatar();
      hidePopup(type);
      break;
    case "closePopup":
      hidePopup(type);
      setCorrectAvatarInAvatarsPopup();
      clearErrorMessage();
      break;
  }
}
