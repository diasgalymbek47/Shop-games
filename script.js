//Корзина (Хотелось создать класс но пока знаний маловато и решил сдеать так!)
let Cart = new Object();
Cart = {
  sum: 0,
  list: [],
  // Метод рендера корзину
  render() {
    const cartBody = document.querySelector(".cart-body");

    if (cartBody.querySelectorAll(".list").length > 0) cartBody.querySelector(".list").remove();

    const list = document.createElement("ul");
    list.classList.add("list");

    for (const item of this.list) {
      let li = document.createElement("li");
      li.classList.add("list-item");
      li.innerHTML = `<div class="cart-product" data-id="${Cart[item].id}">
                          <img class="cart-product-img" src="${Cart[item].urlImage}" />
                          <div class="cart-product-about">
                            <div class="cart-product-name">${Cart[item].name}</div>
                            <div class="cart-product-price">${Cart[item].price} тг</div>
                            <div class="cart-product-date">${Cart[item].date} г</div>
                          </div>
                          <div class="cart-product-counter">
                            <button class="cart-product-increase" onclick="counter(this, '${Cart[item].name}', '+')">+</button>
                            <div class="cart-product-count">${Cart[item].count}</div>
                            <button class="cart-product-decrease" onclick="counter(this, '${Cart[item].name}', '-')">-</button>
                          </div>
                          <button class="cart-product-delete" onclick="deleteToCart(this, '${Cart[item].name}')">
                            <img src="./delete.png" />
                          </button>
                        </div>`;

      list.append(li);
    }

    cartBody.insertAdjacentElement("beforeend", list);
    cartCheck();
    Cart.calculateSum();
  },
  // Вычислить общую сумму корзины
  calculateSum() {
    const sumContainer = document.querySelector(".cart-price");

    let sum = 0;

    for (const item of this.list) {
      let count = Cart[item].count;
      let price = Cart[item].price;

      sum += count * price;
    }

    this.sum = sum;
    sumContainer.textContent = `Общая сумма: ${sum}`;
  },
};

//Вызываемые функции в начале скрипта
getListGames("https://diasgalymbek47.github.io/Shop-games/games.json");

//Проверить корзину на пустоту
function cartCheck() {
  const cart = document.querySelector(".cart");
  const list = cart.querySelector(".list");
  const empty = cart.querySelector(".empty");

  if (list) {
    empty.classList.toggle("hidden", list.querySelectorAll(".list-item").length > 0);
  } else {
    empty.classList.remove("hidden");
  }
}

//Показать модального окна
function showModal(btn, modalClass) {
  const modal = document.querySelector(`.${modalClass}`);

  modal.classList.add("show");

  document.addEventListener("click", (e) => {
    const inner = e.composedPath().includes(modal.querySelector(".modal-wrapper"));
    const Openbtn = e.composedPath().includes(btn);

    if (!inner && !Openbtn) modal.classList.remove("show");
  });

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-modal")) modal.classList.remove("show");
  });
}

//Получить список игры из фейк сервера
function getListGames(url) {
  fetch(`${url}`)
    .then((response) => response.json())
    .then((data) => render("gamesList", data));
}

//Отрисовать данные внутри контейнера
function render(_class, data) {
  const container = document.querySelector(`.${_class}`);

  for (const item of data) {
    container.innerHTML += `<li class="list-item">
                                <div class="card" data-id="${item["id"]}">
                                  <div class="card-description">
                                      <button class="card-description-btn" onclick="showProductDescription('${item["id"]}')"></button>
                                      <div class="card-description-title">Подробнее</div>
                                  </div>
                                  <img class="card-img" src="${item["urlImage"]}"/>
                                  <div class="card-body">
                                      <h3 class="card-name">${item["name"]}</h3>
                                      <p class="card-price">${item["price"]} тг</p>
                                      <p class="card-date">${item["date"]}г</p>
                                      <button class="cart-add" onclick="addToCartBtn(this)">в корзину</button>
                                  </div>
                                </div>
                            </li> `;
  }
}

//Кнопка для добавления в (корзину) или удаление из (корзины)
function addToCartBtn(btn) {
  let card = btn.closest(".card");

  const id = card.dataset.id;
  const urlImage = card.querySelector(".card-img").getAttribute("src");
  const name = card.querySelector(".card-name").textContent;
  const price = getNumber(card.querySelector(".card-price").textContent);
  const date = getNumber(card.querySelector(".card-date").textContent);

  let product = {
    id: id,
    urlImage: urlImage,
    name: name,
    price: Number(price),
    date: date,
    count: 1,
  };

  if (!btn.classList.contains("added")) {
    addToCart(btn, product);
  } else {
    removeToCart(btn, product);
  }
}

//Функция для добавления в список
function addToCart(btn, product) {
  btn.textContent = "✓ добавлено";
  btn.classList.add("added");

  Cart[product.name] = product;
  Cart.list.push(product.name);
}

//Функция для удаления из список
function removeToCart(btn, product) {
  btn.classList.remove("added");
  btn.textContent = "в корзину";

  delete Cart[product.name];

  let index = Cart.list.indexOf(product.name);
  Cart.list.splice(index, 1);
}

//Кнопка для удаления из корзины
function deleteToCart(btn, productName) {
  const product = btn.closest(".list-item");
  product.remove();

  const addBtn = document.querySelector('.card[data-id="' + Cart[productName].id + '"]').querySelector(".cart-add");
  addBtn.classList.remove("added");
  addBtn.textContent = "в корзину";

  delete Cart[productName];

  let index = Cart.list.indexOf(productName);
  Cart.list.splice(index, 1);

  cartCheck();
  Cart.calculateSum();
}

//Функция для счетчика товара
function counter(btn, productName, operation) {
  switch (operation) {
    case "+":
      Cart[productName].count++;
      break;
    case "-":
      Cart[productName].count--;
      break;
  }

  if (Cart[productName].count == 0) Cart[productName].count++;

  const counter = btn.closest(".cart-product-counter");
  const counterText = counter.querySelector(".cart-product-count");
  counterText.textContent = Cart[productName].count;

  Cart.calculateSum();
}

//
function showProductDescription(id) {
  const body = document.querySelector("body");

  const div = document.createElement("div");
  div.classList.add("description");

  fetch("https://diasgalymbek47.github.io/Shop-games/games.json")
    .then((response) => response.json())
    .then((data) => {
      for (const item of data) {
        if (item["id"] == id) {
          div.innerHTML = `<div class="description-wrapper">
                        <button class="description-close" onclick="descriptionClose(this)">Закрыть</button>
                        <img class="product-img" src="${item.urlImage}" />
                        <div class="product-about">
                          <div class="product-name">${item.name}</div>
                          <div class="product-description">
                            ${item.description}
                          </div>
                          <div class="product-date">${item.date} г</div>
                        </div>
                      </div>`;
        }
      }
    });

  body.insertAdjacentElement("beforeend", div);
}

//
function descriptionClose(btn) {
  const description = btn.closest(".description");
  description.remove();
}

//Функция для удаления не нужных букв и пробел от числа
function getNumber(number) {
  return number
    .replace(/[a-zа-яё]/gi, "")
    .split(" ")
    .join("");
}
