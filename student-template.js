"use strict";

// Практическая работа №8
// Тема: события, формы и клиентская валидация.

// 1. Счётчик по click.
function setupCounter() {
  const button = document.getElementById("counter-button");
  const valueEl = document.getElementById("counter-value");

  button.addEventListener("click", () => {
    const current = Number(valueEl.textContent) || 0;
    valueEl.textContent = String(current + 1);
  });

  return button;
}

// 2. Предпросмотр текста по input.
function setupLivePreview() {
  const input = document.getElementById("name-input");
  const preview = document.getElementById("name-preview");

  input.addEventListener("input", () => {
    const value = input.value;
    preview.textContent = value === "" ? "—" : value;
  });

  return input;
}

// 3. Делегированное удаление пунктов.
function setupListDelegation() {
  const list = document.getElementById("task-list");

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.classList.contains("remove-button")) {
      const li = target.closest("li");
      if (li) li.remove();
    }
  });

  return list;
}

// 4. Чтение формы.
function readRegistrationForm() {
  const form = document.getElementById("registration-form");
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const age = Number(form.elements.age.value);
  const course = form.elements.course.value;
  const agree = form.elements.agree.checked;

  return { name, email, age, course, agree };
}

// 5. Валидация.
function validateRegistration(data) {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push("Имя должно содержать минимум 2 символа.");
  }
  if (!data.email || !data.email.includes("@")) {
    errors.push("Email должен содержать символ @.");
  }
  if (!Number.isFinite(data.age) || data.age < 16) {
    errors.push("Возраст должен быть числом не меньше 16.");
  }
  if (!data.agree) {
    errors.push("Необходимо согласие с условиями.");
  }

  return errors;
}

// 6. Обработка submit.
function setupRegistrationForm() {
  const form = document.getElementById("registration-form");
  const errorsList = document.getElementById("form-errors");
  const resultEl = document.getElementById("form-result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    errorsList.innerHTML = "";
    resultEl.textContent = "";

    const data = readRegistrationForm();
    const errors = validateRegistration(data);

    if (errors.length > 0) {
      for (const message of errors) {
        const li = document.createElement("li");
        li.textContent = message;
        errorsList.appendChild(li);
      }
      return;
    }

    resultEl.textContent = `Регистрация принята: ${data.name}`;
  });

  return form;
}

window.eventsFormsLab = {
  setupCounter,
  setupLivePreview,
  setupListDelegation,
  readRegistrationForm,
  validateRegistration,
  setupRegistrationForm,
};
