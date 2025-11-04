
const slides = document.querySelectorAll('.slide');
let i = 0;
setInterval(() => {
  slides[i].classList.remove('active');
  i = (i + 1) % slides.length;
  slides[i].classList.add('active');
}, 4000);

// 🍴 Food Discovery Section
document.addEventListener("DOMContentLoaded", () => {
  const foods = [
    { name: 'Traditional Thali', price: 199, desc: 'Authentic regional platter with curries and rice.' },
    { name: 'Street Snacks', price: 149, desc: 'Crispy and flavorful street bites loved by locals.' },
    { name: 'Fusion Meal', price: 249, desc: 'Creative mix of Indian and global flavors.' },
    { name: 'Dessert Delight', price: 179, desc: 'Sweet endings to your perfect journey.' },
    { name: 'Seafood Special', price: 299, desc: 'Fresh coastal flavors for your travel craving.' },
    { name: 'Vegan Bowl', price: 189, desc: 'Healthy and delicious plant-based dishes.' }
  ];

  const foodGrid = document.getElementById('foodGrid');
  if (foodGrid) {
    foodGrid.innerHTML = foods.map(f => `
      <div class="bg-white rounded-xl shadow hover:shadow-xl p-5 transition hover:-translate-y-1">
        <h3 class="font-semibold text-lg mb-1">${f.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${f.desc}</p>
        <span class="font-bold text-amber-600">₹${f.price}</span>
      </div>
    `).join('');
  }
});

// 🗺️ Map setup
const map = L.map('map').setView([22.9734, 78.6569], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routingControl;

async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.length ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
}

// 🚍 Route Finder
document.getElementById('tripForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const from = document.getElementById('fromInput').value.trim();
  const to = document.getElementById('toInput').value.trim();
  const output = document.getElementById('routesList');
  output.innerHTML = "Finding route...";

  const fromCoords = await geocodeLocation(from);
  const toCoords = await geocodeLocation(to);

  if (!fromCoords || !toCoords) {
    output.innerHTML = `<p class="text-red-500">❌ Couldn't find one or both locations. Try again.</p>`;
    return;
  }

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [L.latLng(fromCoords), L.latLng(toCoords)],
    routeWhileDragging: false,
    addWaypoints: false,
    lineOptions: { styles: [{ color: '#2563eb', weight: 5 }] }
  }).addTo(map);

  map.fitBounds([fromCoords, toCoords], { padding: [50, 50] });

  routingControl.on('routesfound', e => {
    const route = e.routes[0].summary;
    output.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="font-semibold">${from} → ${to}</div>
        <div class="text-sm text-gray-500">Distance: ${(route.totalDistance / 1000).toFixed(1)} km · Time: ${(route.totalTime / 3600).toFixed(1)} hrs</div>
      </div>`;
  });
});
