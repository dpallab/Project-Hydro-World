/* 
let ratingStarInput=[...document.querySelectorAll('.rating-star')];
ratingStarInput.map((star, index) => {
    star.addEventListener('click', () => {
    for (let i = 0; i < 5; i++){ 
        if(i <= index) {
    ratingStarInput[i].src = `../resources/img/fill star.png`;
    } else{
    ratingStarInput[i].src = `../resources/img/no fill star.png`;
    }
    }
    })
})
 */
// product page setting

let productName = document.querySelector(".product-title");
let shortDes = document.querySelector(".product-desc");
let price = document.querySelector(".price");
let detail = document.querySelector(".des");
let productImage = document.querySelector(".product-image");
let title = document.querySelector("title");
let ratingcount = document.querySelector(".rating-count");
let ratingStar = [...document.querySelectorAll(".star")];
let cartBtn = document.querySelector(".cart-btn");

const setData = (data) => {
  productName.innerHTML = title.innerHTML = data.productName;
  productImage.src = data.imagePath;
  shortDes.innerHTML = data.shortDesc;
  detail.innerHTML = data.details;
  price.innerHTML = data.price;

  if (JSON.parse(localStorage.getItem("cart"))) {
    if (
      JSON.parse(localStorage.getItem("cart")).find(
        (item) => item.name == data.productName
      )
    ) {
      cartBtn.innerHTML = "added to cart";
      cartBtn.classList.add("disable");
    }
  }

  cartBtn.addEventListener("click", () => {
    addToCart(data);
    updateNavCartCount();
    // cartBtn.innerHTML=addToCart(data);
    cartBtn.classList.add("disable");
  });
};
const createProductCards = (data, title, ele) => {
  if (data.length) {
    let container = document.querySelector(ele);
    container.innerHTML += `
            <h1 class="section-header">${title}</h1>
            <div class="popular-prod-container">
                ${createCards(data)}
            </div>
        `;
  }
};

const createCards = (data) => {
  let cards = "";

  data.forEach((item) => {
    if (item.id != productId) {
      cards += `
            <div class="popular-prod-card">
                <img src="${item.imagePath}" onclick="location.href = '/products/${item.id}'" class="prod-img" alt="">
                <p class="prod-title">${item.productName}</p>
            </div>
        `;
    }
  });

  return cards;
};
const getProducts = (tag) => {
  return fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ tag: tag }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

const fetchProductData = () => {
  fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id: productId }),
  })
    .then((res) => {
      console.log("Prod data=" + res);
      return res.json();
    })
    .then((data) => {
      console.log("product data= " + data);
      setData(data);

      getProducts(data.tags[0]).then((res) =>
        createProductCards(res, "similar products", ".popular-products")
      );
    })
    .catch((err) => {
      console.log(err);
      alert("no product found");
      location.replace("/404");
    });
};

let productId = null;
if (
  location.pathname != "/add-product" &&
  !location.pathname.includes("/search")
) {
  console.log(decodeURI(location.pathname.split("/").pop()));
  productId = decodeURI(location.pathname.split("/").pop());
  fetchProductData();
}

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartproduct = {
    item: 1,
    name: product.productName,
    price: product.price,
    imagePath: product.imagePath,
    shortDes: product.shortDesc,
  };
  cart.push(cartproduct);
  console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  // return 'added';
};
