async function loadProductDetails() {
    // 1. Məhsul məlumatlarını götür
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const products = await (await fetch("http://localhost:3000/products")).json();
    const product = products.find(p => p.id == id);
  
    // 2. İstifadəçi məlumatları
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const isLoginedUser = users.find(u => u.isLogged === true);
  
    // 3. Container-ı seç və HTML-i doldur
    const container = document.querySelector(".product-container");
    if (!container || !product) return console.error("Məhsul və ya konteyner tapılmadı.");
  
    container.innerHTML = `
      <div class="product-gallery">
       <div class="product-gallery">
  <!-- Thumbnail Images on the left -->
  <div class="product-gallery">
  <!-- Thumbnail Images on the left -->
  <div class="thumbnail-images">
    ${(product.images || [product.thumbnail])
      .map((img, idx) => `
        <img 
          src="${img}" 
          alt="Thumbnail ${idx + 1}" 
          class="thumbnail ${idx === 0 ? 'active' : ''}" 
          onclick="changeMainImage(${idx})"
        />
      `).join("")}
  </div>

  <!-- Main Image on the right -->
  <div class="main-image">
    <img src="${product.images?.[0] || product.thumbnail}" alt="Product Image" id="mainImage" />
    <span class="discount-badge">${product.discountPercentage}%</span>
  </div>
</div>


      <div class="product-info">
        <h2>${product.title}</h2>
        <div class="product-rating">
          <span><i class="fa fa-star text-warning"></i> ${product.rating}</span>
          <span>| ${product.reviews?.length || 0} reviews</span>
        </div>
        <div class="product-price">
          <span class="price">${product.price}$</span>
          <span class="old-price">
            ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}$
          </span>
        </div>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Stock:</strong> 
          <span class="${product.stock<10?'low-stock':''}">
            ${product.stock}
          </span>
        </p>
        <div class="quantity-selector">
          <button class="btn-minus">-</button>
          <input type="number" value="1" min="1" />
          <button class="btn-plus">+</button>
        </div>
        <div class="add-to-basket">
          <button class="btn btn-primary">Add to Basket</button>
          <button class="btn btn-outline">Cash Payment</button>
        </div>
      </div>
    `;
  
    // 4. Thumbnail kliklə əsas şəkli dəyiş və aktiv sinfi təyin et
    const thumbnails = container.querySelectorAll(".thumbnail");
    const mainImg = container.querySelector(".main-image img");
    thumbnails.forEach(thumb => {
      thumb.addEventListener("click", () => {
        // əsas şəkli yenilə
        mainImg.src = thumb.src;
        // bütün thumbnail-lərdən active sinfini sil
        thumbnails.forEach(t => t.classList.remove("active"));
        // kliklənənə active əlavə et
        thumb.classList.add("active");
      });
    });
  
    // 5. Miqdar artım/azaltma
    const qtyInput = container.querySelector(".quantity-selector input");
    container.querySelector(".btn-minus").addEventListener("click", () => {
      let v = parseInt(qtyInput.value);
      if (v > 1) qtyInput.value = v - 1;
    });
    container.querySelector(".btn-plus").addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
  
    // 6. Səbətə əlavə et
    container.querySelector(".btn-primary").addEventListener("click", () => {
      addBasket(product.id, parseInt(qtyInput.value), users, isLoginedUser, products);
    });
  }
  
  function addBasket(id, qty, users, isLoginedUser, products) {
    if (!isLoginedUser) {
      alert("Zəhmət olmasa daxil olun.");
      return;
    }
    const idx = users.findIndex(u => u.id === isLoginedUser.id);
    const basket = isLoginedUser.basket || [];
    const exists = basket.find(p => p.id === id);
  
    if (exists) {
      exists.count += qty;
      alert("Məhsul sayı artırıldı.");
    } else {
      const prod = products.find(p => p.id === id);
      basket.push({ ...prod, count: qty });
      alert("Məhsul səbətə əlavə olundu.");
    }
  
    isLoginedUser.basket = basket;
    users[idx] = isLoginedUser;
    localStorage.setItem("users", JSON.stringify(users));
  }
  
  loadProductDetails();
  