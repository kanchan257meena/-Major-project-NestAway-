const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../Utils/wrapasync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Review = require("../MODELS/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../MODELS/listing.js");



const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//REVIEWS

// 1. post route

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

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
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id ,{$pull : { reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success"," Review Deleted! ");
    res.redirect(`/listings/${id}`);
  })
);

module.exports=router;


