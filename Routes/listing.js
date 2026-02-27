const express = require("express");
const router = express.Router();
// const Listing = require("../MODELS/listing.js");
const wrapAsync = require("../Utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

//Index route
router.get("/", wrapAsync(listingController.index));

//Create : NEW & CREATE route
router.get("/new", isLoggedIn, listingController.new);

router.post("/", validateListing, upload.single("listing[image]"),wrapAsync(listingController.create));


//show route  {return all the data , after we click on link this page will open}
router.get("/:id", wrapAsync(listingController.show));

//Update : edit & update route
/*it will be done in two parts first get request to edit then post the edit part */

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.edit)
);

//can't update directly so we use a method override
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.update));

//DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;
