import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

//Profile elements
const profileAvatar = document.querySelector(".profile__avatar");
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const modals = [...document.querySelectorAll(".modal")];
let storeCardId = null;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "8c84c398-0400-4e0f-ba4f-d3192d94e573",
    "Content-Type": "application/json",
  },
});

//destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    storeCardId = userInfo._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

//Form elements
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editSubmitBtn = editModal.querySelector(".modal__submit-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteModalBtn = document.querySelector(".modal__delete-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalCloseBtn = deleteModal.querySelector(
  ".modal__delete-close-btn"
);

//select modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

//card related items
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  const likeCountElement = evt.target
    .closest(".card")
    .querySelector(".card__like-count");

  api
    .handleLike(id, isLiked)
    .then((response) => {
      evt.target.classList.toggle("card__like-btn_liked");
      likeCountElement.textContent = response.likes ? response.likes : 0;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeCount.textContent = data.likes ? data.likes : 0;

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;

    openModal(previewModal);
  });

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () => {
    storeCardId = {
      id: data._id,
      element: cardElement,
    };
    openModal(deleteModal);
  });

  return cardElement;
}

deleteModalBtn.addEventListener("click", () => {
  deleteModalBtn.textContent = "Deleting...";
  deleteModalBtn.disabled = true;
  api
    .deleteCard(storeCardId.id)
    .then((response) => {
      console.log(response.message); // This will show "This post has been deleted"
      storeCardId.element.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      deleteModalBtn.textContent = "Delete";
      deleteModalBtn.disabled = false;
    });
});

function handleEscape(event) {
  if (event.key == "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    closeModal(currentModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");

  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editSubmitBtn.textContent = "Saving...";
  editSubmitBtn.disabled = true;
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;

      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      editSubmitBtn.textContent = "Save";
      editSubmitBtn.disabled = false;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  cardSubmitBtn.textContent = "Saving...";
  cardSubmitBtn.disabled = true;
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitBtn.textContent = "Save";
      cardSubmitBtn.disabled = false;
    });
}

//-------AVATAR SUBMIT FUNCTION

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  avatarSubmitBtn.textContent = "Saving...";
  avatarSubmitBtn.disabled = true;
  api
    .editAvatarInfo({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      avatarSubmitBtn.textContent = "Save";
      avatarSubmitBtn.disabled = false;
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

// avatar modal function

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(settings);
