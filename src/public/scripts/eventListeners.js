const app = document.querySelector(".app");
const sendMessageBtb = document.querySelector(".chat__footer__send");
const addContactBtn = document.querySelector(".app__menu__add-contact");
const popupCancelBtn = document.querySelector(".popup__btn--cancel");
const popupAddBtn = document.querySelector(".popup__btn--add");
const appMenuContacts = document.querySelector(".app__menu__contacts");
const backArrow = document.querySelector(".chat__header__back-arrow");
const chatContent = document.querySelector(".chat__content");
const appHeaderAvatar = document.querySelector(".app__header__avatar");
const changeAvatarOption = document.getElementById("changeAvatar");
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.addEventListener("click", (e) => {
    const popupOptionBtn = e.target.closest("[data-popup-btn-option]");
    const avatarSelect = e.target.closest(".avatar--select");
    if (popupOptionBtn) popupOptionHandler(popupOptionBtn);
    else if (avatarSelect) {
      selectAvatar(avatarSelect);
    }
  });
  popup.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      const avatarSelect = e.target.closest(".avatar--select");
      if (avatarSelect) {
        selectAvatar(avatarSelect);
      }
    }
  });
});

appMenuContacts.addEventListener("click", (e) => {
  const contact = e.target.closest(".contact");
  if (!contact) return;
  openChat(contact);
});
appMenuContacts.addEventListener("keyup", (e) => {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    const contact = e.target.closest(".contact");
    if (!contact) return;
    openChat(contact);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    const appMobileOpen = document.querySelector(".app--mobile--open");
    if (!appMobileOpen) return;
    sendMessage();
  }
});

addContactBtn.addEventListener("click", () => {
  showPopup("code");
  disactivateFocusableElementsInApp();
});
sendMessageBtb.addEventListener("click", sendMessage);
backArrow.addEventListener("click", returnToContacts);
chatContent.addEventListener("click", (e) => showDateOfMessage(e));
appHeaderAvatar.addEventListener("click", toggleSettings);
appHeaderAvatar.addEventListener("keyup", (e) => {
  console.log(e.key);
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    console.log(1);
    toggleSettings();
  }
});
changeAvatarOption.addEventListener("click", () => {
  showPopup("avatars");
  disactivateFocusableElementsInApp();
});
changeAvatarOption.addEventListener("keyup", (e) => {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    showPopup("avatars");
    disactivateFocusableElementsInApp();
  }
});
window.addEventListener("resize", adjustToWindowSize);
app.addEventListener("click", (e) => hideSettings(e));
