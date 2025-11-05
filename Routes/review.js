const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../Utils/wrapasync.js");
const Review = require("../MODELS/review.js");
const Listing = require("../MODELS/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../Controllers/review.js");

//REVIEWS

// 1. post route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

// 2. delete request

router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewController.delete)
);

module.exports=router;


