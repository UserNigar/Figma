// document.addEventListener("DOMContentLoaded", () => {
//     let users = JSON.parse(localStorage.getItem("users")) ; 
//     let currentUser = users.find(user => user.isLogged === true); 


    
//     let form = document.querySelector("#account-settings-form");
//     let nameInput = document.querySelector("#name");
//     let emailInput = document.querySelector("#email");
//     let passwordInput = document.querySelector("#password");
//     let confirmPasswordInput = document.querySelector("#confirmPassword");
//     let messageDiv = document.querySelector("#message");
//     // let truePassword=document.querySelector(".fa-check")
//     // let falsePasswordStyle=document.querySelector(".fa-x")


//         nameInput.value = currentUser.name;
//         emailInput.value = currentUser.email;


//     form.addEventListener("submit", function (e) {
//         e.preventDefault();

//         let name = nameInput.value.trim();
//         let email = emailInput.value.trim();
//         let password = passwordInput.value;
//         let confirmPassword = confirmPasswordInput.value;

//         if (password !== confirmPassword) {
//             messageDiv.textContent = "Şifrələr uyğun gəlmir!";
//             messageDiv.style.color = "red";
//             return;
//         }

//         // if (password.length <= 8) {
//         //     truePassword.classList.add("d-none");
//         //     truePassword.classList.remove("d-block");
//         //     falsePasswordStyle.classList.add("d-block");
//         //     falsePasswordStyle.classList.remove("d-none");
//         //     messageDiv.textContent = "Şifrə minimum 8 simvol olmalıdır!";
//         //     messageDiv.style.color = "red";
//         //     return;
//         // } else {
//         //     falsePasswordStyle.classList.add("d-none");
//         //     falsePasswordStyle.classList.remove("d-block");
//         //     truePassword.classList.add("d-block");
//         //     truePassword.classList.remove("d-none");
//         // }

//         currentUser.name = name;
//         currentUser.email = email;
//         currentUser.password = password;

      
//         let userIndex = users.findIndex(user => user.id === currentUser.id);
//         if (userIndex !== -1) {
//             users[userIndex] = currentUser;
//             localStorage.setItem("users", JSON.stringify(users)); 
//             localStorage.setItem("currentUser", JSON.stringify(currentUser));
//             toatifyByPage("User data update succsessfully");
//             setTimeout(() => {
//                 window.location.href = "index.html";
//             }, 3000);
//         } 
//     });
//     let toatifyByPage = (text) => {
//         Toastify({
//             text: `${text}`,
//             duration: 3000,
//             gravity: "top",
//             position: "left",
//             stopOnFocus: true,
//             style: {
//                 background: "linear-gradient(to right, #00b09b, #96c93d)",
//             },
//         }).showToast();
//     }
// });
