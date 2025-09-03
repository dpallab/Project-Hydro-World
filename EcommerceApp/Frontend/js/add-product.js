let user = JSON.parse(sessionStorage.user || null);
window.onload = () => {
  if (user == null) {
    location.replace("/login");
  }
};
let editables = [...document.querySelectorAll('*[contenteditable="true"]')];

editables.map((element) => {
  let placeholder = element.getAttribute("data-placeholder");
  element.innerHTML = placeholder;
  element.addEventListener("focus", () => {
    if (element.innerHTML === placeholder) {
      element.innerHTML = "";
    }
  });
  element.addEventListener("focusout", () => {
    if (!element.innerHTML.length) element.innerHTML = placeholder;
  });
});

let uploadInput = document.querySelector("#upload-image");
let imagePath = "../resources/img/404-bg.png"; // default image
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  let imageUrl;
  if (file.type.includes("image")) {
    fetch("/upload-url")
      .then((res) => res.json())
      .then((url) => {
        fetch(url, {
          method: "PUT",
          headers: new Headers({ "Content-Type": "image/jpeg" }),
          body: file,
        }).then((res) => {
          imagePath = url.split("?")[0];
          let productImage = document.querySelector(".product-image");

          productImage.src = imagePath;
        });
      });
  }
});

// form submission
let addProductBtn = document.querySelector(".add-product-btn");
let Loader = document.querySelector(".loader");
let productName = document.querySelector(".product-title");
let shortDes = document.querySelector(".product-desc");
let price = document.querySelector(".price");
let detail = document.querySelector(".des");
let tags = document.querySelector(".tags");

const productData = () => {
  let tagsArr = tags.innerText.split(",");
  tagsArr.forEach((item, i) => tagsArr[i].trim().toLowerCase());

  return {
    productName: productName.innerText,
    shortDesc: shortDes.innerText,
    price: price.innerText,
    details: detail.innerText,
    tags: tagsArr,
    imagePath: imagePath,
    email: JSON.parse(sessionStorage.user).email,
    draft: false,
  };
};

addProductBtn.addEventListener("click", () => {
  //verification
  if (
    productName.innerHTML == productName.getAttribute("data-placeholder") ||
    !productName.innerHTML.length
  ) {
    showFormError("Product name is required");
  } else if (
    shortDes.innerHTML == shortDes.getAttribute("data-placeholder") ||
    !shortDes.innerHTML.length
  ) {
    showFormError("Short description is required");
  } else if (
    price.innerHTML == price.getAttribute("data-placeholder") ||
    !Number(price.innerHTML) ||
    price.innerHTML < 0
  ) {
    showFormError("Price is required");
  } else if (
    detail.innerHTML == detail.getAttribute("data-placeholder") ||
    !detail.innerHTML.length
  ) {
    showFormError("Detail description is required");
  } else if (
    tags.innerHTML == tags.getAttribute("data-placeholder") ||
    !tags.innerHTML.length
  ) {
    showFormError("Tags are required");
  } else {
    Loader.classList.add("active");
    setTimeout(() => {
      Loader.classList.add("hidden"); // Adds 'hidden' class to remove the loader
    }, 1000);

    /* let tagsArr=tags.innerText.split(',');
tagsArr.forEach((tag,index) => tagsArr[index].trim().toLowerCase()); */

    /* let productData = {
productName:productName.innerText,
shortDesc:shortDes.innerText,
price:price.innerText,
details:detail.innerText,
tags:tagsArr,
imagePath:imagePath,
email:JSON.parse(sessionStorage.user).email,
draft:false
};
*/
    let data = productData();
    if (productId) {
      data.id = productId;
    }
    sendData("/add_product", data);
  }
});

// draft btn
let draftBtn = document.querySelector(".draft-btn");

draftBtn.addEventListener("click", () => {
  if (
    !productName.innerHTML.length ||
    productName.innerHTML == productName.getAttribute("data-placeholder")
  ) {
    showFormError("enter product name atleast");
  } else {
    // don't validate the form
    let data = productData();
    //loader.style.dispaly = 'block';
    data.draft = true;
    if (productId) {
      data.id = productId;
    }
    sendData("/add_product", data);
  }
});

// edit page

let productId = null;
const fetchProductData = () => {
  addProductBtn.innerHTML = "save product";
  fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id: productId }),
  })
    .then((res) => res.json())
    .then((data) => {
      setFormData(data);
    })
    .catch((err) => console.log(err));
};

const setFormData = (data) => {
  console.log(data);
  productName.innerHTML = data.productName;
  shortDes.innerHTML = data.shortDesc;
  price.innerHTML = data.price;
  detail.innerHTML = data.details;
  tags.innerHTML = data.tags;

  let productImg = document.querySelector(".product-image");
  productImg.src = imagePath = data.imagePath;
};

if (
  location.pathname.includes("/add_product") &&
  decodeURI(location.pathname.split("/").pop()) != "add_product"
) {
  productId = decodeURI(location.pathname.split("/").pop());
  fetchProductData();
}
