"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const results = document.querySelector("#test-results");
  const fixture = document.querySelector("#fixture");
  const api = window.eventsFormsLab;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function resetFixture() {
    fixture.innerHTML = `
      <button id="counter-button" type="button">+1</button>
      <strong id="counter-value">0</strong>

      <input id="name-input" type="text">
      <strong id="name-preview">—</strong>

      <ul id="task-list">
        <li>Первый <button class="remove-button" type="button">Удалить</button></li>
        <li>Второй <button class="remove-button" type="button">Удалить</button></li>
      </ul>

      <form id="registration-form" novalidate>
        <input name="name" type="text">
        <input name="email" type="email">
        <input name="age" type="number">
        <select name="course">
          <option value="js">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <input name="agree" type="checkbox">
        <button type="submit">Отправить</button>
      </form>
      <ul id="form-errors"></ul>
      <p id="form-result"></p>
    `;
  }

  function test(name, fn) {
    resetFixture();
    try {
      fn();
      const p = document.createElement("p");
      p.className = "ok";
      p.textContent = `✓ ${name}`;
      results.append(p);
    } catch (error) {
      failed++;
      const p = document.createElement("p");
      p.className = "fail";
      p.textContent = `✗ ${name}: ${error.message}`;
      results.append(p);
    }
  }

  test("1. Счётчик по click", () => {
    const button = api.setupCounter();
    const value = document.querySelector("#counter-value");
    assert(button === document.querySelector("#counter-button"), "нужно вернуть кнопку");
    button.click();
    button.click();
    assert(value.textContent === "2", "после двух click значение должно быть 2");
  });

  test("2. Предпросмотр по input", () => {
    const input = api.setupLivePreview();
    const preview = document.querySelector("#name-preview");
    input.value = "Алексей";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    assert(preview.textContent === "Алексей", "предпросмотр не обновился");
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    assert(preview.textContent === "—", "для пустой строки должен быть символ —");
  });

  test("3. Делегированное удаление", () => {
    const list = api.setupListDelegation();
    const secondButton = list.children[1].querySelector(".remove-button");
    secondButton.click();
    assert(list.children.length === 1, "после click один пункт должен удалиться");
    assert(list.children[0].textContent.includes("Первый"), "удалён не тот li");
  });

  test("4. Чтение данных формы", () => {
    const form = document.querySelector("#registration-form");
    form.elements.name.value = "  Иван  ";
    form.elements.email.value = "ivan@example.com";
    form.elements.age.value = "19";
    form.elements.course.value = "python";
    form.elements.agree.checked = true;

    const data = api.readRegistrationForm();
    assert(data.name === "Иван", "name должен быть обработан trim()");
    assert(data.email === "ivan@example.com", "email прочитан неверно");
    assert(data.age === 19, "age должен быть числом 19");
    assert(data.course === "python", "course прочитан неверно");
    assert(data.agree === true, "agree должен быть boolean true");
  });

  test("5. Валидация данных", () => {
    const valid = api.validateRegistration({
      name: "Иван",
      email: "ivan@example.com",
      age: 19,
      course: "js",
      agree: true,
    });
    assert(Array.isArray(valid), "функция должна вернуть массив");
    assert(valid.length === 0, "для корректных данных массив должен быть пустым");

    const invalid = api.validateRegistration({
      name: "A",
      email: "mail",
      age: 14,
      course: "js",
      agree: false,
    });
    assert(invalid.length === 4, "должны быть найдены четыре ошибки");
  });

  test("6. Обработка submit", () => {
    const form = api.setupRegistrationForm();
    const errors = document.querySelector("#form-errors");
    const result = document.querySelector("#form-result");

    form.elements.name.value = "Иван";
    form.elements.email.value = "ivan@example.com";
    form.elements.age.value = "20";
    form.elements.course.value = "js";
    form.elements.agree.checked = true;

    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const dispatchResult = form.dispatchEvent(submitEvent);
    assert(dispatchResult === false, "submit должен быть отменён через preventDefault()");
    assert(errors.children.length === 0, "для корректных данных ошибок быть не должно");
    assert(result.textContent === "Регистрация принята: Иван", "неверный текст успешного результата");

    form.elements.name.value = "";
    form.elements.email.value = "wrong";
    form.elements.age.value = "10";
    form.elements.agree.checked = false;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    assert(errors.children.length === 4, "для некорректных данных нужно вывести четыре li");
    assert(result.textContent === "", "при ошибках успешный результат нужно очистить");
  });

  const summary = document.createElement("p");
  summary.id = "test-summary";
  summary.textContent = failed === 0 ? "Все тесты пройдены." : `Ошибок: ${failed}.`;
  summary.className = failed === 0 ? "ok" : "fail";
  results.append(summary);
});
