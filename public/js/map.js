
console.log("map.js loaded");

const mapDiv = document.getElementById("map");
const locations = mapDiv.dataset.location;
const coordinates = JSON.parse(mapDiv.dataset.coordinates);

console.log(coordinates);

const lat = coordinates[1];
const lon = coordinates[0];

const map = L.map('map').setView([lat, lon], 13);
console.log("map created")

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
{
 attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([lat, lon]).addTo(map).bindPopup(`<b> ${locations} <b>`)
.openPopup();