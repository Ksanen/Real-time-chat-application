const sendMessageBtb = document.querySelector(".app__chat__footer__send");
const addContactBtn = document.querySelector(".app__menu__add-contact");
const popupCancelBtn = document.querySelector(".popup__btn--cancel");
const popupAddBtn = document.querySelector(".popup__btn--add");
const popupContact = document.querySelector(".app__menu__contacts");

popupContact.addEventListener("click", (e) => {
  const contact = e.target.closest(".contact");
  if (contact) {
    openChat(contact);
  }
});

popupCancelBtn.addEventListener("click", () => {
  hidePopUp();
  clearErrorMessage();
});
popupAddBtn.addEventListener("click", () => {
  if (!addChat()) hidePopUp();
});
addContactBtn.addEventListener("click", showPopup);
sendMessageBtb.addEventListener("click", sendMessage);
