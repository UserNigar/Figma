document.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let form = document.querySelector(".form-box.register form");
    let name = form.querySelector("input[placeholder='Name']");
    let username = form.querySelector("input[placeholder='Username']");
    let email = form.querySelector("input[placeholder='Email']");
    let password = form.querySelector("input[placeholder='Password']");
    let confirmPassword = form.querySelector("input[placeholder=' Confirm Password']");

    let truePassword = document.createElement("i");
    truePassword.className = "fa-solid fa-check text-success d-none";
    password.parentElement.appendChild(truePassword);

    let falsePasswordStyle = document.createElement("i");
    falsePasswordStyle.className = "fa-solid fa-x text-danger d-none";
    password.parentElement.appendChild(falsePasswordStyle);

    form.addEventListener("submit", register);

    function register(e) {
        e.preventDefault();

        let id = uuidv4(); 
        let trimmedUsername = username.value.trim();
        let trimmedEmail = email.value.trim();
        let trimmedPassword = password.value;

        if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
            alert("Username must be between 3 and 20 characters");
            return;
        }

        if (trimmedPassword !== confirmPassword.value) {
            alert("Passwords do not match");
            return;
        }

        if (trimmedPassword.length < 8) {
            truePassword.classList.add("d-none");
            falsePasswordStyle.classList.remove("d-none");
            alert("Password must be at least 8 characters");
            return;
        } else {
            falsePasswordStyle.classList.add("d-none");
            truePassword.classList.remove("d-none");
        }

        if (users.some(user => user.username === trimmedUsername)) {
           alert("Username already exists");
            return;
        }

        if (users.some(user => user.email === trimmedEmail)) {
            alert("Email has already been used");
            return;
        }

        let newUser = {
            id,
            name: name.value.trim(),
            username: trimmedUsername,
            email: trimmedEmail,
            password: trimmedPassword,
            isLogged: false,
            wishlist: [],
            basket: []
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        form.reset();
    alert("Qeydiyyat uğurla tamamlandı! Log in edin");
    }


});
