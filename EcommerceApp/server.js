import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import stripe from "stripe";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj1uknJ00rG2tzxyLANOvXD239vVuiitA",
  authDomain: "ecom-138b4.firebaseapp.com",
  projectId: "ecom-138b4",
  storageBucket: "ecom-138b4.firebasestorage.app",
  messagingSenderId: "726293558415",
  appId: "1:726293558415:web:bddbcbb40b2d017ffe2cfa",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

//INITIALIZE EXPRESS SERVER
const app = express();
app.use(cors());
const PORT = 3000;

// MIDDLEWARE STARTS//

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express
app.use(express.static("Frontend"));

app.use(express.json()); //Enables form data sharing

// MIDDLEWARE ENDS//

//AWS
import aws from "aws-sdk";
import "dotenv/config";
/*const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
*/
//aws setup
const region = "ap-south-1";
const bucketName = "ecom-awsbucket";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.update({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

//init S3
const s3 = new aws.S3();
//generate image URL
async function generateUploadURL() {
  let date = new Date();
  const imageName = `${date.getTime()}.jpeg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    ContentType: "image/jpeg",
    Expires: 300,
  };
  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
  } catch (error) {
    console.log(error);
  }
}

app.get("/upload-url", (req, res) => {
  generateUploadURL().then((url) => res.json(url));
});
// ROUTES FOR FRONTEND SERVER //

//route home
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "Frontend/html" });
});

//route signup
app.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: "Frontend/html" });
});

app.post("/signup", (req, res) => {
  const { name, email, password, phone, tc } = req.body;
  //res.json({'alert':'alert noticed'});
  //res.redirect('/pagenotfound');
  //console.log(res);

  //store the data in db
  const users = collection(db, "users");

  getDoc(doc(users, email)).then((user) => {
    if (user.exists()) {
      return res.json({ alert: "email already exists" });
    } else {
      //encrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          req.body.password = hash;
          req.body.seller = false;

          //set the doc
          setDoc(doc(users, email), req.body).then((data) => {
            res.json({
              name: req.body.name,
              email: req.body.email,
              selller: req.body.seller,
              signup: true,
            });
          });
        });
      });
    }
  });
});

//route Login
app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "Frontend/html" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email.length || !password.length) {
    return res.json({ alert: "provide all credentials" });
    //res.redirect('/pagenotfound');
    //console.log(res);
  }

  //store the data in db
  const users = collection(db, "users");

  getDoc(doc(users, email)).then((user) => {
    if (!user.exists()) {
      return res.json({ alert: "user does not exist" });
    } else {
      bcrypt.compare(password, user.data().password, (err, result) => {
        if (result) {
          let data = user.data();
          return res.json({
            name: data.name,
            email: data.email,
            seller: data.seller,
            login: true,
          });
        } else {
          return res.json({ alert: "Incorrect password" });
        }
      });
    }
  });
});

//seller route
app.get("/seller", (req, res) => {
  res.sendFile("seller.html", { root: "Frontend/html" });
});

app.post("/seller", (req, res) => {
  const { businessname, email, address, about, contact } = req.body;

  const sellers = collection(db, "sellers");
  setDoc(doc(sellers, email), req.body).then((data) => {
    const users = collection(db, "users");
    updateDoc(doc(users, email), {
      seller: true,
    }).then((data) => {
      res.json({ seller: true });
    });
  });
});
//Search route
app.get("/search/:key", (req, res) => {
  res.sendFile("search.html", { root: "Frontend/html" });
});

//product route
app.get("/product", (req, res) => {
  res.sendFile("product.html", { root: "Frontend/html" });
});

//dashboard route
app.get("/dashboard", (req, res) => {
  res.sendFile("dashboard.html", { root: "Frontend/html" });
});

app.post("/get-products", (req, res) => {
  const { email, id, tag } = req.body;
  const products = collection(db, "products");
  let docName;
  if (id) {
    console.log("received id=" + id);
    docName = getDoc(doc(products, id));
    console.log(docName);
  } else if (tag) {
    docName = getDocs(query(products, where("tags", "array-contains", tag)));
  } else if (email) {
    docName = getDocs(query(products, where("email", "==", email)));
  }
  else {
    docName = getDocs(products);
  }



  docName.then((products) => {
    if (products.empty) {
      return res.json("No products available");
    }

    let productArray = [];
    if (id) {
      console.log(products.data());
      return res.json(products.data());
    } else {
      products.forEach((item) => {
        // console.log(item);

        let data = item.data();
        data.id = item.id;
        productArray.push(data);
      });
    }

    res.json(productArray);
  });
});

//add-product route
app.get("/add_product", (req, res) => {
  res.sendFile("add-product.html", { root: "Frontend/html" });
});

app.get("/add_product/:id", (req, res) => {
  res.sendFile("add-product.html", { root: "Frontend/html" });
});

//aboutuss
app.get ("/aboutus", (req, res) => {
  res.sendFile("aboutus.html", { root: "Frontend/html" });
});

//contact
app.get ("/contact", (req, res) => {
  res.sendFile("contact.html", { root: "Frontend/html" });
});

app.post("/add_product", (req, res) => {
  let {
    productName,
    shortDesc,
    price,
    details,
    tags,
    imagePath,
    email,
    draft,
    id,
  } = req.body;

  let docName =
    id == undefined
      ? `${productName.toLowerCase()}-${Math.floor(Math.random() * 58000)}`
      : id;
  let products = collection(db, "products");

  setDoc(doc(products, docName), req.body)
    .then((data) => {
      res.json({ product: productName });
    })
    .catch((err) => {
      res.json({ alert: "some error occured" });
    });
});

//delete product route
app.post("/delete-product", (req, res) => {
  const { id } = req.body;

  deleteDoc(doc(collection(db, "products"), id))
    .then((data) => {
      res.json("SuccessFull");
    })
    .catch((error) => {
      res.json("Error_found");
    });
});

//dynamic product page
app.get("/products/:id", (req, res) => {
  res.sendFile("product.html", { root: "Frontend/html" });
});

//add review route
app.post("/add-review", (req, res) => {
  const { headline, review, rate, productId, email } = req.body;

  //store in Firestore
  const reviews = collection(db, "reviews");
  setDoc(doc(reviews, `review-${email}-${productId}`), req.body)
    .then((data) => {
      console.log("inside server.js add-review= " + data);
      res.json("review");
    })
    .catch((err) => {
      res.json({ alert: "some error occured" });
    });
});

app.post("/get-reviews", (req, res) => {
  const { productId, email } = req.body;
  const reviews = collection(db, "reviews");
  getDocs(query(reviews, where("productId", "==", productId))).then(
    (review) => {
      console.log("inside getreviews of server.js= ", review);
      let reviewArray = [];
      if (review.empty) {
        return res.json(reviewArray);
      }
      let userEmail = false;
      review.forEach((item, i) => {
        let reviewEmail = item.data().email;
        if (reviewEmail == email) {
          userEmail = true;
        }

        reviewArray.push(item.data());
      });

      if (!userEmail) {
        getDoc(doc(reviews, `review-${email}-${productId}`)).then((data) => {
          console.log("inside getreviews of server.js= ", data.data());
          reviewArray.push(data.data());
        });
      }
      return res.json(reviewArray);

      /* let reviewArray=[];
        data.forEach(item=>{
            let review=item.data();
            review.id=item.id;
            reviewArray.push(review);
        })
        res.json(reviewArray); */
    }
  );
});

//cart route
app.get("/cart", (req, res) => {
  res.sendFile("cart.html", { root: "Frontend/html" });
});

//CheckOut
app.get("/checkout", (req, res) => {
  res.sendFile("checkout.html", { root: "Frontend/html" });
});
//stripe payment section
let stripeGateway = stripe(process.env.STRIPE_SECRET_KEY);
let DOMAIN = process.env.DOMAIN;

//Place Order
app.post("/place-order", async (req, res) => {
  const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&order=${encodeURIComponent(
      JSON.stringify(req.body)
    )}`,
    cancel_url: `${DOMAIN}/checkout`,
    line_items: req.body.items.map((item) => {
      console.log(item);
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            description: item.shortDes,
            images: [item.imagePath],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.item,
      };
    }),

    customer_email: req.body.email,
  });
  res.json({ url: session.url });
});

app.get("/success", async (req, res) => {
  let { order, session_id } = req.query;
  try {
    const session = await stripeGateway.checkout.sessions.retrieve(session_id);
    // const customer= await stripeGateway.customers.retrieve(session.customer);
    const customer = session.customer_details;
    console.log(customer);
    //console.log(order);

    let date = new Date();
    let orders_collection = collection(db, "orders");
    let docname = `${customer.email}-order-${date.getTime()}`;

    setDoc(doc(orders_collection, docname), JSON.parse(order)).then((data) => {
      res.redirect("/checkout?payment=done");
      // res.redirect('/confirmpayment');
    });
  } catch (err) {
    console.log(err);
    res.redirect("/404");
  }
});

//allprodcuts route
app.get("/allproduct", (req, res) => {
  res.sendFile("allproduct.html", { root: "Frontend/html" });
});

//route 404
app.get("/pagenotfound", (req, res) => {
  res.sendFile("404.html", { root: "Frontend/html" });
});

//to use this page as redirection whenever user tries to access some path that does not exist
app.use((req, res) => {
  res.redirect("/pagenotfound");
});
/*    
//route 404
app.get('*', (req,res) => {
    res.sendFile("404.html",{root:"Frontend/html"});
} );
*/

app.listen(PORT, () => {
  console.log("Listening on Port 3000");
});
