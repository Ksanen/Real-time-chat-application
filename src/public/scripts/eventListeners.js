const sendMessageBtb = document.querySelector(".chat__footer__send");
const addContactBtn = document.querySelector(".app__menu__add-contact");
const popupCancelBtn = document.querySelector(".popup__btn--cancel");
const popupAddBtn = document.querySelector(".popup__btn--add");
const popupContact = document.querySelector(".app__menu__contacts");
const backArrow = document.querySelector(".chat__header__back-arrow");
const chatContent = document.querySelector(".chat__content");
const appHeaderAvatar = document.querySelector(".app__header__avatar");
const popupAvatars = document.querySelector(".popup__avatars");
const changeAvatarOption = document.getElementById("changeAvatar");
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.addEventListener("click", (e) => {
    const popupCancelBtn = e.target.closest(".popup__btn--cancel");
    if (!popupCancelBtn) return;
    hidePopUp(popupCancelBtn);
  });
});
popupContact.addEventListener("click", (e) => {
  const contact = e.target.closest(".contact");
  if (contact) {
    openChat(contact);
  }
});

popupAddBtn.addEventListener("click", addChat);
addContactBtn.addEventListener("click", () => showPopup("code"));
sendMessageBtb.addEventListener("click", sendMessage);
backArrow.addEventListener("click", returnToContacts);
chatContent.addEventListener("click", (e) => showDateOfMessage(e));
appHeaderAvatar.addEventListener("click", toggleSettings);
popupAvatars.addEventListener("click", (e) => selectAvatar(e));
changeAvatarOption.addEventListener("click", () => showPopup("avatars"));
window.addEventListener("resize", adjustToWindowSize);
window.addEventListener("click", (e) => hideSettings(e));
