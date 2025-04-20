document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let isLoginedUser = users.find(user => user.isLogged === true);

  if (!isLoginedUser || !isLoginedUser.basket) return;

  let userBasket = isLoginedUser.basket;
  const basketContainer = document.getElementById("basket-container");

  async function fetchProductData() {
    try {
      const res = await fetch("http://localhost:3000/products");
      return await res.json();
    } catch (err) {
      console.error("Məhsullar yüklənmədi:", err);
      return [];
    }
  }

  function saveBasket() {
    const userIndex = users.findIndex(user => user.id === isLoginedUser.id);
    users[userIndex] = isLoginedUser;
    localStorage.setItem("users", JSON.stringify(users));
  }

  async function createBasketItem() {
    basketContainer.innerHTML = "";

    if (userBasket.length === 0) {
      basketContainer.innerHTML = "<p class='empty-basket'>Səbət boşdur.</p>";
      return;
    }

    const products = await fetchProductData();
    let totalPrice = 0;

    userBasket.forEach(basketItem => {
      const product = products.find(p => p.id === basketItem.id);
      if (!product) return;

      const basketDiv = document.createElement("div");
      basketDiv.className = "basket-item";

      const imageDiv = document.createElement("div");
      imageDiv.className = "image";
      const img = document.createElement("img");
      img.src = Array.isArray(product.image) && product.image.length > 0
        ? product.image[0]
        : "https://via.placeholder.com/150"; // Əgər şəkil yoxdursa, ehtiyat şəkil göstər
      img.alt = product.title;
      imageDiv.appendChild(img);

      const title = document.createElement("h6");
      title.className = "title";
      title.textContent = product.title;

      const category = document.createElement("p");
      category.className = "category";
      category.textContent = product.category;

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `${product.price}$`;

      const countArea = document.createElement("div");
      countArea.className = "count-area";

      const minusBtn = document.createElement("button");
      minusBtn.className = "minus-btn";
      minusBtn.textContent = "-";
      minusBtn.disabled = basketItem.count === 1;

      const count = document.createElement("p");
      count.className = "count";
      count.textContent = basketItem.count;

      const plusBtn = document.createElement("button");
      plusBtn.className = "plus-btn";
      plusBtn.textContent = "+";

      countArea.appendChild(minusBtn);
      countArea.appendChild(count);
      countArea.appendChild(plusBtn);

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-danger";
      removeBtn.textContent = "Sil";

      basketDiv.appendChild(imageDiv);
      basketDiv.appendChild(title);
      basketDiv.appendChild(category);
      basketDiv.appendChild(price);
      basketDiv.appendChild(countArea);
      basketDiv.appendChild(removeBtn);

      basketContainer.appendChild(basketDiv);

      totalPrice += product.price * basketItem.count;

      minusBtn.addEventListener("click", () => {
        if (basketItem.count > 1) {
          basketItem.count--;
          saveBasket();
          createBasketItem();
        }
      });

      plusBtn.addEventListener("click", () => {
        basketItem.count++;
        saveBasket();
        createBasketItem();
      });

      removeBtn.addEventListener("click", () => {
        userBasket = userBasket.filter(p => p.id !== basketItem.id);
        isLoginedUser.basket = userBasket;
        saveBasket();
        createBasketItem();
      });
    });

    const total = document.createElement("p");
    total.className = "total-price";
    total.textContent = `Ümumi: ${totalPrice.toFixed(2)} $`;
    basketContainer.appendChild(total);

    // const deleteAllBtn = document.createElement("button");
    // deleteAllBtn.className = "btn btn-danger delete-all";
    // deleteAllBtn.textContent = "Səbəti Təmizlə";

    // deleteAllBtn.addEventListener("click", () => {
    //   userBasket = [];
    //   isLoginedUser.basket = [];
    //   saveBasket();
    //   createBasketItem();
    // });

    basketContainer.appendChild(deleteAllBtn);
  }

  createBasketItem();
});
