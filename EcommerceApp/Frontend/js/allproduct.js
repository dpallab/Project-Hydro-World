//let user = JSON.parse(sessionStorage.user || null)
console.log(user.name);
if (user == null) {
  location.replace("/login");
} else if (!user.seller) {
  location.replace("/seller");
}

let greeting = document.querySelector("#seller-greeting");
greeting.innerHTML += user.name;

const createProduct = (data) => {
  console.log(data);
  let productContainer = document.querySelector(".product-container");

  productContainer.innerHTML += `
    <div class="popular-prod-card">
            <!--    <button class="btn edit-btn" onclick="location.href = '/add_product/${data.id}'"><img src="../resources/img/edit.png" alt=""></button>
                <button class="btn delete-btn" onclick="deleteItem('${data.id}')"><img src="../resources/img/delete.png" alt=""></button>
                -->
                <button class="btn open-btn" onclick="location.href = '/products/${data.id}'"><img src="../resources/img/open.png" alt=""></button>

                <img src="${data.imagePath}" class="prod-img">
                <p class="prod-title">${data.productName}</p>
    </div>
    `;
};

// const deleteItem = (id) => {
//     fetch('/delete-product', {
//         method: 'post',
//         headers: new Headers({'Content-Type': 'application/json'}),
//         body: JSON.stringify({id: id})
//     }).then(res => res.json())
//     .then(data => {
//         // process data
//         console.log(data);
//         if(data == 'SuccessFull'){
//             location.reload();
//         } else{
//            // showAlert('some error occured');
//         }
//     })
// }

const setupProducts = () => {
  fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    // body: JSON.stringify({product : 'all' })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data from dashboard: " + data);
      //        loader.style.display = 'none';
      if (data == "No products available") {
        document.querySelector(".dashboard-bg").style.display = "block";
      } else {
        data.forEach((product) => createProduct(product));
      }
    });
};

setupProducts();
