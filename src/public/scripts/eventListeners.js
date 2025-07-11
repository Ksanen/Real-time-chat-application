const sendMessageBtb = document.querySelector(".chat__footer__send");
const addContactBtn = document.querySelector(".app__menu__add-contact");
const popupCancelBtn = document.querySelector(".popup__btn--cancel");
const popupAddBtn = document.querySelector(".popup__btn--add");
const popupContact = document.querySelector(".app__menu__contacts");
const backArrow = document.querySelector(".chat__header__back-arrow");
const chatContent = document.querySelector(".chat__content");
const appHeaderAvatar = document.querySelector(".app__header__avatar");
popupContact.addEventListener("click", (e) => {
  const contact = e.target.closest(".contact");
  if (contact) {
    openChat(contact);
  }
});

popupCancelBtn.addEventListener("click", hidePopUp);
popupAddBtn.addEventListener("click", addChat);
addContactBtn.addEventListener("click", showPopup);
sendMessageBtb.addEventListener("click", sendMessage);
backArrow.addEventListener("click", returnToContacts);
chatContent.addEventListener("click", (e) => showDateOfMessage(e));
appHeaderAvatar.addEventListener("click", toggleSettings);
window.addEventListener("resize", adjustToWindowSize);
window.addEventListener("click", (e) => hideSettings(e));
