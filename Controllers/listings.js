const Listing = require("../MODELS/listing");
// const fetch = require("node-fetch");


//index
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find(); // get array of docs
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.send("Error fetching listings");
  }
};

//new
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

//create
module.exports.create = async (req, res, next) => {

  const location = req.body.listing.location;

  
const response = await fetch(
`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
{
headers:{
"User-Agent":"major-project-app"
}
});

  const data = await response.json();

 

  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

// map
 const lon = data[0].lon;
  const lat = data[0].lat;
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat]
  };

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


//show
module.exports.show = async (req, res) => {
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
};

//edit
module.exports.edit = async (req, res) => {
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
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

 if(typeof req.file!=="undefined"){
   let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
   await listing.save();
 }
 
  req.flash("success", "Review Updated! ");
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.delete = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
  }
};

// Map to show all listings
module.exports.mapPage = async (req, res) => {
  const listings = await Listing.find(
    { geometry: { $exists: true } },
    { title: 1, location: 1, geometry: 1 }
  );

  console.log("Listings count:", listings.length);

  res.render("listings/map.ejs", { listings });
};
