let aircraftMarkers = new Map();
let selectedPlaneCallsign = null;
let selectedFlightIcao24 = null;
let routeLayerGroup = L.layerGroup();
const MAX_PLANES = 1200;
let mapLayer = null;
const flightSearchInput = document.getElementById('flightSearch');
const searchButton = document.getElementById('searchButton');
let selectedDestination = null;

const airplaneIconRotated = (angle) => L.divIcon({
  className: '',
  html: `<img src="Public/imgs/comp/plane.png" style="width:24px; transform: rotate(${angle}deg); transition: transform 1s linear;">`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const map = L.map('map', { zoomControl: false }).setView([26.8206, 30.8025], 6);
routeLayerGroup.addTo(map);

function addTileLayer(style) {
  if (mapLayer) map.removeLayer(mapLayer);
  const tiles = style === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  mapLayer = L.tileLayer(tiles, { attribution: '&copy; OpenStreetMap contributors' });
  mapLayer.addTo(map);
}

function setupMapStyleButtons() {
  document.getElementById('light-mode')?.addEventListener('click', () => addTileLayer('light'));
  document.getElementById('dark-mode')?.addEventListener('click', () => addTileLayer('dark'));
}

function getReadableDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateETA(distanceMeters, speedMS) {
  if (!speedMS || speedMS <= 0) return { eta: 'Unknown', duration: 'Unknown' };
  const etaSeconds = distanceMeters / speedMS;
  const etaDate = new Date(Date.now() + etaSeconds * 1000);
  return {
    eta: etaDate.toUTCString().replace(/GMT.*/, 'UTC'),
    duration: getReadableDuration(etaSeconds)
  };
}

function updateFlightInfoBox({ callsign, origin_country, lat, lon, velocity, altitude, eta, distanceKm, duration, destination, type }) {
  const infoPanel = document.querySelector('.flight-info');
  infoPanel.innerHTML = `
    <div class="flight-row"><span class="label">Flight:</span><span class="value">${callsign}</span></div>
    <div class="flight-row"><span class="label">Country:</span><span class="value">${origin_country}</span></div>
    <div class="flight-row"><span class="label">Lat / Lon:</span><span class="value">${lat.toFixed(2)}, ${lon.toFixed(2)}</span></div>
    <div class="flight-row"><span class="label">Altitude:</span><span class="value">${Math.round(altitude)} m</span></div>
    <div class="flight-row"><span class="label">Speed:</span><span class="value">${Math.round(velocity)} m/s</span></div>
    <div class="flight-row"><span class="label">ETA (est.):</span><span class="value">${eta}</span></div>
    <div class="flight-row"><span class="label">Duration:</span><span class="value">${duration}</span></div>
    <div class="flight-row"><span class="label">To:</span><span class="value">${destination}</span></div>
    <div class="flight-row"><span class="label">Distance:</span><span class="value">${distanceKm} km</span></div>
    <div class="flight-row"><span class="label">Type:</span><span class="value">${type || 'Unknown'}</span></div>
  `;
}

async function getNearestAirport(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    const data = await res.json();
    return data.address?.airport || data.address?.city || data.address?.town || data.display_name || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

async function updateSelectedFlight(lat, lon, angle, speed, altitude, callsign, origin_country) {
  if (!selectedDestination) return;

  const [destLat, destLon, destinationName] = selectedDestination;
  const distance = haversineDistance(lat, lon, destLat, destLon);
  const { eta, duration } = calculateETA(distance, speed);

  updateFlightInfoBox({
    callsign, origin_country, lat, lon, altitude,
    velocity: speed, eta, duration,
    distanceKm: (distance / 1000).toFixed(2),
    destination: destinationName,
    type: 'Airliner'
  });

  routeLayerGroup.clearLayers();
  L.polyline([[lat, lon], [destLat, destLon]], {
    color: '#00ffff', weight: 4, opacity: 0.8, dashArray: '5, 8'
  }).addTo(routeLayerGroup);

  const pulseIcon = L.divIcon({
    className: 'pulse-icon',
    html: '<div class="pulse-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  L.marker([destLat, destLon], { icon: pulseIcon }).addTo(routeLayerGroup);
}

async function fetchLiveAircraft() {
  try {
    const res = await fetch('https://opensky-network.org/api/states/all');
    const result = await res.json();
    if (!result?.states) return;

    const filtered = result.states.filter(s =>
      s[6] && s[5] && s[9] > 10 && s[1] && !s[1].includes('77777') && !s[1].includes('PRIVATE')
    ).slice(0, MAX_PLANES);

    aircraftMarkers.forEach(marker => map.removeLayer(marker));
    aircraftMarkers.clear();

    for (const state of filtered) {
      const [icao24, callsignRaw, origin_country, , , lon, lat, altitude, , speed, angle] = state;
      const callsign = callsignRaw?.trim() || 'Unknown';

      const marker = L.marker([lat, lon], { icon: airplaneIconRotated(angle || 0) }).addTo(map);
      marker.bindPopup(`✈️ ${callsign}<br>Alt: ${Math.round(altitude)} m`);

      marker.on('click', async () => {
        selectedPlaneCallsign = callsign;
        selectedFlightIcao24 = icao24;

        const destLat = lat + Math.cos(angle * Math.PI / 180) * 2000000 / 111320;
        const destLon = lon + Math.sin(angle * Math.PI / 180) * 2000000 / (40075000 * Math.cos(lat * Math.PI / 180) / 360);
        const destination = await getNearestAirport(destLat, destLon);
        selectedDestination = [destLat, destLon, destination];

        updateSelectedFlight(lat, lon, angle, speed, altitude, callsign, origin_country);
        map.setView([lat, lon], 7);
      });

      aircraftMarkers.set(callsign, marker);

      if (icao24 === selectedFlightIcao24) {
        marker.setLatLng([lat, lon]);
        marker.setIcon(airplaneIconRotated(angle || 0));
        updateSelectedFlight(lat, lon, angle, speed, altitude, callsign, origin_country);
      }
    }
  } catch (err) {
    console.error('Failed to fetch OpenSky data:', err);
  }
}

addTileLayer('light');
setupMapStyleButtons();
fetchLiveAircraft();
setInterval(fetchLiveAircraft, 5000);

flightSearchInput.addEventListener('input', () => {
  const term = flightSearchInput.value.trim().toUpperCase();
  const suggestionBox = document.querySelector('.search-suggestions');
  suggestionBox.innerHTML = '';
  if (!term || term.length < 2) return suggestionBox.style.display = 'none';

  const matches = Array.from(aircraftMarkers.keys()).filter(k => k.includes(term)).slice(0, 5);
  if (!matches.length) return suggestionBox.style.display = 'none';

  matches.forEach(match => {
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.textContent = match;
    div.onclick = () => {
      flightSearchInput.value = match;
      suggestionBox.style.display = 'none';
      const marker = aircraftMarkers.get(match);
      if (marker) {
        selectedPlaneCallsign = match;
        marker.fire('click');
      }
    };
    suggestionBox.appendChild(div);
  });
  suggestionBox.style.display = 'block';
});

searchButton.addEventListener('click', () => {
  const term = flightSearchInput.value.trim().toUpperCase();
  if (!term) return;
  const match = aircraftMarkers.get(term);
  if (match) {
    selectedPlaneCallsign = term;
    match.fire('click');
  } else {
    alert('No matching flight');
  }
});

window.addEventListener('resize', () => {
  map.invalidateSize();
});
