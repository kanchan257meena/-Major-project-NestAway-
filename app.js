if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
//console.log(process.env); //can access here any passwrd


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./MODELS/user.js");

const listingRouter = require("./Routes/listing.js");
const reviewRouter= require("./Routes/review.js");
const userRouter=require("./Routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/NestAway");
}

const sessoinOptions = {
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// session
app.use(session(sessoinOptions));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080, () => {
  console.log("server start");
});

// defining local variables which can be accessed in ejs file
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
  next();
});



//using the listing router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//middleware
app.use((err, req, res, next) => {
  // res.send("something went wrong");
  let { statusCode = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.all(/.*/,(req,res,next)=>{  //This is something different for express 5
//   next(new ExpressError(404,"Page Not Found"));
// })

//listings
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"india",
//     });

//  await   sampleListing.save().then((res)=>{
//     console.log(res);

//  })
//  console.log("saved");
//  res.send("successfull testing");

// });
