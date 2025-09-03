//cart functionality

let totalBill = 0;
/* const addToCart = (product) =>{
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartproduct={
        item:1,
        name:product.productName,
        price:product.price,
        imagePath:product.imagePath,
        shortDes:product.shortDesc
    }
    cart.push(cartproduct);
    console.log(cart)
    localStorage.setItem('cart',JSON.stringify(cart));
   // return 'added';
}
 */
const checkpaymentstatus = () => {
  if (location.search.includes("payment=done")) {
    localStorage.removeItem("cart");
  }
};
checkpaymentstatus();
const createSmallCards = (data) => {
  return `<div class="sm-product">
                    <img src="${
                      data.imagePath
                    }" class="sm-product-img" alt="cart product">
                    <div class="sm-product-detail">
                        <p class="sm-product-title">${data.name}</p>
                        <p class="sm-product-desc">${data.shortDes}</p>
                                
                    </div>
                    <div class="item-counter">
                        <button class="counter-btn decrement">-</button>
                        <p class="item-count">${data.item}</p>
                        <button class="counter-btn increment">+</button>
                    </div>
                    
                    <p class="sm-price" data-price="${data.price}">${
    data.price * data.item
  }</p>
                    <button class="sm-delete-btn"><img src="../resources/img/cros.jpg" alt=""></button>
                 </div>`;
};

const setCartProducts = () => {
  const cartContainer = document.querySelector(".cart-container");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  if (cart == null || cart.length == 0) {
    cartContainer.innerHTML += `<img src="../resources/img/empty1.jpg" class="empty-img" alt="empty cart">`;
  } else {
    for (let i = 0; i < cart.length; i++) {
      cartContainer.innerHTML += createSmallCards(cart[i]);
      totalBill += Number(cart[i].price * cart[i].item);

      updateBill();
    }
  }
  setupCartEvents();
};

updateBill = () => {
  const bill = document.querySelector(".bill");
  bill.innerHTML = `&#8377;${totalBill}`;
};

const setupCartEvents = () => {
  const decrementBtns = document.querySelectorAll(".decrement");
  const incrementBtns = document.querySelectorAll(".increment");
  const deleteBtns = document.querySelectorAll(".sm-delete-btn");
  const itemCounts = document.querySelectorAll(".item-count");
  const itemPrices = document.querySelectorAll(".sm-price");

  let cart = JSON.parse(localStorage.getItem("cart"));
  itemCounts.forEach((itemCount, index) => {
    decrementBtns[index].addEventListener("click", () => {
      if (cart[index].item > 1) {
        cart[index].item -= 1;
        itemCount.innerHTML = cart[index].item;
        itemPrices[index].innerHTML = cart[index].price * cart[index].item;
        localStorage.setItem("cart", JSON.stringify(cart));
        totalBill -= Number(cart[index].price);
        updateBill();
        // updateNavCartCount();
      }
    });
    incrementBtns[index].addEventListener("click", () => {
      cart[index].item += 1;
      itemCount.innerHTML = cart[index].item;
      itemPrices[index].innerHTML = cart[index].price * cart[index].item;
      localStorage.setItem("cart", JSON.stringify(cart));
      totalBill += Number(cart[index].price);
      updateBill();
      // updateNavCartCount();
    });
    /* deleteBtns[index].addEventListener('click', () => {
            cart.splice(index, 1);
            localStorage.setItem('cart',JSON.stringify(cart));
            // remove the DOM element from the page
            deleteBtns[index].closest('.sm-product').remove();
            console.log(cart.length);
            // recalculate total bill
            totalBill = cart.reduce((sum, product) => sum + product.price * product.item, 0);
            updateBill();
    
            const cartContainer = document.querySelector('.cart-container');
            if(cart == null || cart.length == 0){
            cartContainer.innerHTML += `<img src="../resources/img/empty-cart.png" class="empty-img" alt="empty cart">`
            }
          
            console.log(cart);
            //location.reload();
            //setCartProducts();
        }) */

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productCard = e.target.closest(".sm-product");
        const allCards = Array.from(document.querySelectorAll(".sm-product"));
        const index = allCards.indexOf(productCard);

        if (index > -1) {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          productCard.remove();
          updateNavCartCount();

          const cartContainer = document.querySelector(".cart-container");
          if (cart == null || cart.length == 0) {
            cartContainer.innerHTML += `<img src="../resources/img/empty1.jpg" class="empty-img" alt="empty cart">`;
            totalBill = `00`;
          } else {
            totalBill = cart.reduce(
              (sum, product) => sum + product.price * product.item,
              0
            );
          }
          updateBill();
        }
      });
    });
  });
};

setCartProducts();
