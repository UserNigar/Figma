document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let isLoginedUser = users.find(user => user.isLogged === true);

  if (!isLoginedUser || !isLoginedUser.basket) return;

  let userBasket = isLoginedUser.basket;
  const cartProducts = document.querySelector(".cart-products");
  const totalPriceElement = document.querySelector(".total span.total-price");
  const subtotalElement = document.querySelector(".cart-summary p span");
  const searchInput = document.getElementById("searchInput"); 

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

  async function createBasketItems() {
    cartProducts.innerHTML = "";
    if (userBasket.length === 0) {
      cartProducts.innerHTML = "<p class='empty-basket'>Səbət boşdur.</p>";
      document.querySelector(".cart-summary .total span").textContent = "US $0.00";
      document.querySelector(".cart-summary p span").textContent = "US $0.00";
      return;
    }

    const products = await fetchProductData();
    let total = 0;

    userBasket.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      const img = document.createElement("img");
      img.src = `${product.images?.[0] || product.thumbnail}`;
      img.alt = product.title;

      const itemInfo = document.createElement("div");
      itemInfo.className = "item-info";
      itemInfo.innerHTML = ` 
        <h4>${product.title}</h4>
        <p>Kateqoriya: ${product.category}</p>
        <p>Çatdırılma: 5-7 gün</p>
        <label>
          Miqdar:
          <select>
            <option>${item.count}</option>
          </select>
        </label>
      `;

      const itemActions = document.createElement("div");
      itemActions.className = "item-actions";

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `US $${(product.price * item.count).toFixed(2)}`;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      const favBtn = document.createElement("button");
      favBtn.className = "favorite";
      favBtn.innerHTML = "&#9825; Favorite";

      
      if (isLoginedUser.wishlist && isLoginedUser.wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
        favBtn.style.color = 'red';
      }

      favBtn.addEventListener("click", () => {
        if (isLoginedUser.wishlist && isLoginedUser.wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
         
          isLoginedUser.wishlist = isLoginedUser.wishlist.filter(wishlistItem => wishlistItem.id !== item.id);
          favBtn.style.color = ''; 
          toatifyByPage("Məhsul wishlist-dən silindi");
        } else {
          
          isLoginedUser.wishlist = isLoginedUser.wishlist || [];
          isLoginedUser.wishlist.push(item);
          favBtn.style.color = 'red'; 
          toatifyByPage("Məhsul wishlist-ə əlavə olundu");
        }
        saveBasket();
      });

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove";
      removeBtn.textContent = "Sil";

      removeBtn.addEventListener("click", () => {
        userBasket = userBasket.filter(b => b.id !== item.id);
        isLoginedUser.basket = userBasket;
        saveBasket();
        createBasketItems();
        toatifyByPage("Məhsul səbətdən silindi");
      });

      actionsDiv.appendChild(favBtn);
      actionsDiv.appendChild(removeBtn);

      itemActions.appendChild(price);
      itemActions.appendChild(actionsDiv);

      cartItem.appendChild(img);
      cartItem.appendChild(itemInfo);
      cartItem.appendChild(itemActions);

      cartProducts.appendChild(cartItem);

      total += product.price * item.count;
    });

    document.querySelector(".cart-summary .total span").textContent = `US $${total.toFixed(2)}`;
    document.querySelector(".cart-summary p span").textContent = `US $${total.toFixed(2)}`;
  }

  createBasketItems();

  searchInput.addEventListener("input", async () => {
    const searchText = searchInput.value.toLowerCase().trim();
    const products = await fetchProductData();

    const filteredBasket = userBasket.filter(item => {
      const product = products.find(p => p.id === item.id);
      return product && product.title.toLowerCase().includes(searchText);
    });

    createBasketItems(filteredBasket);
  });
});

let toatifyByPage = (text) => {
  Toastify({
    text: text,
    duration: 3000,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right,rgb(136, 39, 87),rgb(233, 5, 126))",
    },
  }).showToast();
};








