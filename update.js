const mongoose = require("mongoose");
const Listing = require("./MODELS/listing.js"); // adjust path if needed

async function updateListings() {
  await mongoose.connect("mongodb://127.0.0.1:27017/NestAway");

  const listings = await Listing.find();

  for (let listing of listings) {
    try {
      console.log("Processing:", listing.title);

      const location = listing.location;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "major-project",
          },
        },
      );

      const data = await response.json();

      if (data.length > 0) {
        const lon = data[0].lon;
        const lat = data[0].lat;

        listing.geometry = {
          type: "Point",
          coordinates: [lon, lat],
        };

        await listing.save();

        console.log("Updated:", listing.title);
      } else {
        console.log("No coordinates found for:", listing.title);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  console.log("All listings updated!");

  mongoose.connection.close();
}

updateListings();
