let ratingStarInput = [...document.querySelectorAll(".rating-star")];
let rate = 0;

ratingStarInput.map((star, index) => {
  star.addEventListener("click", () => {
    rate = `${index + 1}.0`;
    for (let i = 0; i < 5; i++) {
      if (i <= index) {
        ratingStarInput[i].src = `../resources/img/fill star.png`;
      } else {
        ratingStarInput[i].src = `../resources/img/no fill star.png`;
      }
    }
  });
});

//add review form
let reviewHeadline = document.querySelector(".review-headline");
let reviewField = document.querySelector(".review-field");
let addReviewBtn = document.querySelector(".add-review-btn");

addReviewBtn.addEventListener("click", () => {
  if (user == null) {
    location.href = `/login?after_page=${productId}`;
  } else {
    if (reviewHeadline.value.length && reviewField.value.length && rate) {
      let data = {
        headline: reviewHeadline.value,
        review: reviewField.value,
        rate: rate,
        productId: productId,
        email: user.email,
      };
      sendData("/add-review", data);
    } else {
      showFormError("fill all the fields");
    }
  }
});

//fetch reviews
const fetchReviewData = () => {
  if (user == null) {
    location.href = `/login?after_page=${productId}`;
  }
  fetch("/get-reviews", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ productId: productId, email: user.email }),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      // setData(data);
      console.log(data);
      if (data.length) {
        console.log(data.length);
        data.length > 1
          ? (ratingcount.innerHTML = data.length + " reviews")
          : (ratingcount.innerHTML = data.length + " review");
        //ratingcount.innerHTML=data.length+' reviews';
        let totalrate = 0,
          avgrate = 0;
        for (let i = 0; i < data.length; i++) {
          console.log(Number(data[i].rate));
          totalrate += Number(data[i].rate);
        }
        avgrate = totalrate / data.length;
        console.log(avgrate);
        for (let i = 0; i < 5; i++) {
          if (i < avgrate) {
            ratingStar[i].src = `../resources/img/fill star.png`;
          } else {
            ratingStar[i].src = `../resources/img/no fill star.png`;
          }
        }
        createReviewSection(data);
      } else {
        ratingcount.innerHTML = "no reviews yet";
        //createReviewSection([]);
      }
    })
    .catch((err) => console.log(err));
};

fetchReviewData();

const createReviewSection = (data) => {
  let reviewSection = document.querySelector(".review-section");
  reviewSection.innerHTML += `
    <h1 class="section-title"><span>Reviews</span> </h1> 
    <div class="review-container">
    ${createReviewCard(data)}
       
    </div>
    `;
};

const createReviewCard = (data) => {
  let cards = ``;

  for (let i = 0; i < 4; i++) {
    if (data[i]) {
      console.log("rating=" + data[i].rate);
      cards += `
            <div class="review-card">
    <div class="user-dp" data-rating="${data[i].rate}"><img src="../resources/img/user 1.png" alt=""></div>
    <h2 class="review-title">${data[i].headline}</h2>
    <p class="review">${data[i].review} </p>
    </div>
            `;
    }
  }
  return cards;
};
