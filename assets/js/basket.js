document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isLoginedUser = users.find(user => user.isLogged === true);
  
    if (!isLoginedUser || !isLoginedUser.basket) return;
  
    let userBasket = isLoginedUser.basket;
    const basketContainer = document.getElementById("basket-container");
  
    function saveBasket() {
      const userIndex = users.findIndex(user => user.id === isLoginedUser.id);
      users[userIndex] = isLoginedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  
    function createBasketItem() {
      basketContainer.innerHTML = "";
  
      if (userBasket.length === 0) {
        basketContainer.innerHTML = "<p class='empty-basket'>Səbət boşdur.</p>";
        return;
      }
  
      let totalPrice = 0;
  
      userBasket.forEach(product => {
        const basketItem = document.createElement("div");
        basketItem.className = "basket-item";
  
        const imageDiv = document.createElement("div");
        imageDiv.className = "image";
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = "Product Image";
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
        minusBtn.disabled = product.count === 1;
  
        const count = document.createElement("p");
        count.className = "count";
        count.textContent = product.count;
  
        const plusBtn = document.createElement("button");
        plusBtn.className = "plus-btn";
        plusBtn.textContent = "+";
  
        countArea.appendChild(minusBtn);
        countArea.appendChild(count);
        countArea.appendChild(plusBtn);
  
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-danger";
        removeBtn.textContent = "Sil";
  
        basketItem.appendChild(imageDiv);
        basketItem.appendChild(title);
        basketItem.appendChild(category);
        basketItem.appendChild(price);
        basketItem.appendChild(countArea);
        basketItem.appendChild(removeBtn);
  
        basketContainer.appendChild(basketItem);
  
        totalPrice += product.price * product.count;
  
        minusBtn.addEventListener("click", () => {
          if (product.count > 1) {
            product.count--;
            saveBasket();
            createBasketItem();
          }
        });
  
        plusBtn.addEventListener("click", () => {
          product.count++;
          saveBasket();
          createBasketItem();
        });
  
        removeBtn.addEventListener("click", () => {
          userBasket = userBasket.filter(p => p.id !== product.id);
          isLoginedUser.basket = userBasket;
          saveBasket();
          createBasketItem();
        });
      });
  
      const total = document.createElement("p");
      total.className = "total-price";
      total.textContent = `Ümumi: ${totalPrice.toFixed(2)} $`;
      basketContainer.appendChild(total);
  

      const deleteAllBtn = document.createElement("button");
      deleteAllBtn.className = "btn btn-danger delete-all";
      deleteAllBtn.textContent = "Səbəti Təmizlə";
  
      deleteAllBtn.addEventListener("click", () => {
        userBasket = [];
        isLoginedUser.basket = [];
        saveBasket();
        createBasketItem();
      });
  
      basketContainer.appendChild(deleteAllBtn);
    }
  
    createBasketItem();
  });
  