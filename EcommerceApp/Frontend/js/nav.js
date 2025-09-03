createNavbar();
let userIcon = document.querySelector(".user-icon");
let userPopupIcon = document.querySelector(".user-icon-popup");
userIcon.addEventListener("click", () =>
  userPopupIcon.classList.toggle("active")
);

let text = userPopupIcon.querySelector("p");
let actionBtn = userPopupIcon.querySelector("a");

let user = JSON.parse(sessionStorage.user || null);

if (user != null) {
  text.innerHTML = `Logged in as, ${user.name}`;
  actionBtn.innerHTML = "logout";
  actionBtn.addEventListener("click", () => logout());
} else {
  text.innerHTML = `Login to your account`;
  actionBtn.innerHTML = "login";
  actionBtn.addEventListener("click", () => (location.href = "/login"));
}

const logout = () => {
  console.log(sessionStorage.user);
  sessionStorage.clear();
  console.log(sessionStorage.user);
  location.reload();
};

function createNavbar() {
  let navbar = document.querySelector(".nav-panel");

  navbar.innerHTML += `
    
        <!-- Navigation Links-->
        <ul class="links-container">
            <li class="link-item"><a href="/" class="link active">home</a></li>
            <li class="link-item"><a href="/allproduct" class="link">product</a></li>
            <li class="link-item"><a href="/aboutus" class="link">about us</a></li>
            <li class="link-item"><a href="/contact" class="link">contact</a></li>
        </ul>

        <!-- User Interactive Section -->
        <div class="nav-user">
            <div class="search-box">
                <input type="text" class="search" placeholder="search item">
                <button class="search-btn"><img src="../resources/img/search.png" alt=""></button>         
            </div>
            <div class="cart" onclick="location.href='/cart' ">
                <img src="../resources/img/cart.png" class="cart-icon" alt="">
                <span class="count-cartitems">00</span>
            </div>
            <div class="user">
                <img src="../resources/img/user.png" class="user-icon" alt="">
                <div class="user-icon-popup">
                        <p>Login to your account</p>
                        <a>Login</a>
                </div>
            </div>
           

        </div>

    `;
}

// search box

let searchBtn = document.querySelector(".search-btn");
let searchBox = document.querySelector(".search");

searchBtn.addEventListener("click", () => {
  if (searchBox.value.length) {
    location.href = `/search/${searchBox.value}`;
  }
});

//nav cart count
const updateNavCartCount = () => {
  let count = JSON.parse(localStorage.getItem("cart")).length || 0;
  console.log(count);
  let countElement = document.querySelector(".count-cartitems");
  if (count == 0) {
    countElement.innerHTML = "00";
  } else if (count <= 9 && count > 0) {
    countElement.innerHTML = `0${count}`;
  } else if (count <= 99 && count > 9) {
    countElement.innerHTML = `${count}`;
  } else {
    countElement.innerHTML = "99+";
  }
  //countElement.innerHTML = count;
};

const checkpaymentstatusinnav = () => {
  if (location.search.includes("payment=done")) {
    localStorage.removeItem("cart");
    updateNavCartCount();
  }
};
checkpaymentstatusinnav();
updateNavCartCount();
