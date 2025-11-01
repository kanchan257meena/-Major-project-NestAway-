const express = require("express");
const router = express.Router();
const Listing = require("../MODELS/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../Utils/ExpressError.js");
const wrapAsync = require("../Utils/wrapasync.js");


//function for validating schema
//it will be passed as a middleware

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//Index route
router.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find(); // get array of docs
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.send("Error fetching listings");
  }
});


//Create : NEW & CREATE route
router.get("/new", (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error","you must be logged in to create listing!");
  return  res.redirect("/login");
  }
  res.render("listings/new.ejs");
  
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //if anything goes wrong we'll send err

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created! ");
    res.redirect("/listings");
  })
);



//show route  {return all the data , after we click on link this page will open}
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    try {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
      }
      res.render("listings/show.ejs", { listing });
    } catch (err) {
      console.log(err);
    }
  })
);


//Update : edit & update route
/*it will be done in two parts first get request to edit then post the edit part
 */
router.get("/:id/edit",validateListing,wrapAsync(async (req, res) => {
    try {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
    } catch (err) {
      console.log(err);
      console.log("error");
    }
  })
);

//can't update directly so we use a method override
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Review Updated! ");
    res.redirect(`/listings/${id}`);
  })
);

//DELETE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    try {
      let { id } = req.params;
      let deletedlist = await Listing.findByIdAndDelete(id);
      console.log(deletedlist);
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    } catch (err) {
      console.log(err);
    }
  })
);

module.exports = router;
