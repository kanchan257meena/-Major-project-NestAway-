const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../Utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controllers/users.js");

//Signup
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(userController.signup));

// Login

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;
