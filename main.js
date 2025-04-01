// Create a map centered at a specific latitude and longitude
var map = L.map('map').setView([51.505, -0.09], 2);  // Coordinates for a global view (London)

// Add a tile layer (e.g., OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


setTimeout(function() {
    map.invalidateSize();
}, 500);

document.addEventListener("DOMContentLoaded", function() {
    map.invalidateSize();
});


        