const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../MODELS/user.js");
const wrapasync = require("../Utils/wrapasync.js");
const passport = require("passport");

//Signup
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.flash("success", "Welcome to NestAway!");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// Login

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome to NestAway");
    res.redirect("/listings");
  }
);

module.exports = router;
