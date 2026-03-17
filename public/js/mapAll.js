console.log("mapAll loaded");

const mapDiv = document.getElementById("allmap");
// const listings = JSON.parse(mapDiv.dataset.listings);
const listings = window.listings;

const map = L.map("allmap");

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
{
 attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const bounds = [];

listings.forEach(listing => {
  const coords = listing.geometry.coordinates;

  bounds.push([coords[1], coords[0]]);

  L.marker([coords[1], coords[0]])
    .addTo(map)
    .bindPopup(`<a href="/listings/${listing._id}">${listing.title}</a>`);
});

map.fitBounds(bounds);