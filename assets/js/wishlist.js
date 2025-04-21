document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isLoginedUser = users.find(user => user.isLogged === true);
  
    if (!isLoginedUser || !isLoginedUser.wishlist) return;
  
    let userWishlist = isLoginedUser.wishlist;
  
    function createWishlistItem() {
      let wishlistTag = document.querySelector(".wishlist");
      wishlistTag.innerHTML = ""; 
      userWishlist.forEach(item => {
        let wishlistItem = document.createElement("div");
        wishlistItem.classList.add("wishlist-item");
  
        let image = document.createElement("div");
        image.classList.add("image");
  
        let img = document.createElement("img");
        img.src = `${item.images?.[0] || item.thumbnail}`; 
  
        image.appendChild(img);
  
        let title = document.createElement("h5");
        title.classList.add("title");
        title.textContent = item.title;
  
        let category = document.createElement("p");
        category.classList.add("category");
        category.textContent = item.category;
  
        let price = document.createElement("p");
        price.classList.add("price");
        price.textContent = `$${item.price}`;
  
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger", "remove-btn");
        removeBtn.textContent = "Sil";
  
        removeBtn.addEventListener("click", () => {
         
          let index = userWishlist.findIndex(product => product.id === item.id);
          if (index !== -1) {
            userWishlist.splice(index, 1);
            isLoginedUser.wishlist = userWishlist;
            let userIndex = users.findIndex(user => user.id === isLoginedUser.id);
            users[userIndex] = isLoginedUser;
            localStorage.setItem("users", JSON.stringify(users));
            createWishlistItem(); 
          }
        });
  
        wishlistItem.append(image, title, category, price, removeBtn);
        wishlistTag.appendChild(wishlistItem);
      });
    }
  
    createWishlistItem();
  });
  