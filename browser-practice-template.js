"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const api = window.eventsFormsLab;

  if (!api) {
    console.error("Не найден объект window.eventsFormsLab");
    return;
  }

  api.setupCounter();
  api.setupLivePreview();
  api.setupListDelegation();
  api.setupRegistrationForm();
});
