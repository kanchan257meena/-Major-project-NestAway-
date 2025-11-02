const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../Utils/wrapasync.js");
const Review = require("../MODELS/review.js");
const Listing = require("../MODELS/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//REVIEWS

// 1. post route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    req.flash("success","New Review Created! ");
    res.redirect(`/listings/${listing._id}`);
  })
);

// 2. delete request

router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id ,{$pull : { reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success"," Review Deleted! ");
    res.redirect(`/listings/${id}`);
  })
);

module.exports=router;


