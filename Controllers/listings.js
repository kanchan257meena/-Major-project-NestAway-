const Listing=require("../MODELS/listing");

//index
module.exports.index=async (req, res) => {
  try {
    const allListings = await Listing.find(); // get array of docs
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.send("Error fetching listings");
  }
};

//new
module.exports.new=(req, res) => {
  res.render("listings/new.ejs");
}

//create
module.exports.create=async (req, res, next) => {
    //if anything goes wrong we'll send err
  let url=req.file.path;
  let filename=req.file.filename;
   
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created! ");
    res.redirect("/listings");
  }

//show
module.exports.show=async (req, res) => {
    try {
      let { id } = req.params;
      const listing = await Listing.findById(id)
        .populate({
          path: "reviews",
          populate: {
            path: "author",
          },
        })
        .populate("owner");
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
      }
      res.render("listings/show.ejs", { listing });
    } catch (err) {
      console.log(err);
    }
  }


  //edit
  module.exports.edit=async (req, res) => {
      try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
      } catch (err) {
        console.log(err);
        console.log("error");
      }
    };

    //update
    module.exports.update=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Review Updated! ");
    res.redirect(`/listings/${id}`);
  };


  //delete
  module.exports.delete=async (req, res) => {
    try {
      let { id } = req.params;
      let deletedlist = await Listing.findByIdAndDelete(id);
      console.log(deletedlist);
      req.flash("success", "Listing Deleted!");
      res.redirect("/listings");
    } catch (err) {
      console.log(err);
    }
  }