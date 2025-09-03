window.onload = () => {
  user = JSON.parse(sessionStorage.user || null);
  console.log(user);
  if (user == null) {
    location.replace("/login?after_page=checkout");
  }
  if (location.search.includes("payment=done")) {
    // let items=[];
    // localStorage.setItem('cart',JSON.stringify(items));
    //localStorage.removeItem('cart');
    //window.location.reload();
    //showFormError('Payment done successfully');
    document.querySelector(".place-order-btn").style.display = "none";
    document.querySelector(".payment-success").style.display = "block";
  }
};

//Actions for place order button
let placeOrderBtn = document.querySelector(".place-order-btn");
placeOrderBtn.addEventListener("click", () => {
  let address = getaddress();
  if (address != null) {
    fetch("/place-order", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        items: JSON.parse(localStorage.getItem("cart")),
        address: address,
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((url) => {
        console.log(url);
        location.replace(url.url);
      })
      .catch((err) => console.log(err));
  }
});

const getaddress = () => {
  let address = document.querySelector("#address").value;
  let street = document.querySelector("#street").value;
  let city = document.querySelector("#city").value;
  let state = document.querySelector("#state").value;
  let pincode = document.querySelector("#pincode").value;
  let landmark = document.querySelector("#landmark").value;

  if (
    !address.length ||
    !street.length ||
    !city.length ||
    !state.length ||
    !pincode.length ||
    !landmark.length
  ) {
    console.log("All filds are required");
    showFormError("All filds are required");
    return null;
  } else {
    return {
      address,
      street,
      city,
      state,
      pincode,
      landmark,
    };
  }
};
