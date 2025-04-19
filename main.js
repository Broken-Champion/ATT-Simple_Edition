document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    const map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 2);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fix map sizing issues
    setTimeout(() => map.invalidateSize(), 100);
    window.addEventListener('resize', () => map.invalidateSize());

    // Add map controls functionality
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
    document.getElementById('locate-me').addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(pos => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 13);
            L.marker([pos.coords.latitude, pos.coords.longitude])
                .addTo(map)
                .bindPopup("Your location")
                .openPopup();
        }, () => alert("Could not get your location"));
    });

    

    // Mobile menu functionality
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.listItems');
    
    menuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.listItems a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            !e.target.closest('.listItems') &&
            !e.target.closest('.mobile-menu-btn') &&
            navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });



    // Flight data with more details
    const flightData = {
        'AB123': { 
            airline: 'Air Berlin', 
            departure: 'JFK (New York)', 
            arrival: 'LHR (London)', 
            status: 'En Route',
            altitude: '35,000 ft',
            speed: '540 knots',
            aircraft: 'Boeing 737-800',
            position: [40.64, -73.78] // JFK coordinates
        },
        'AB124': { 
            airline: 'Air Berlin', 
            departure: 'LAX (Los Angeles)', 
            arrival: 'CDG (Paris)', 
            status: 'Delayed',
            altitude: '0 ft',
            speed: '0 knots',
            aircraft: 'Airbus A320',
            position: [33.94, -118.41] // LAX coordinates
        },
        'AB125': { 
            airline: 'Air Berlin', 
            departure: 'ORD (Chicago)', 
            arrival: 'FRA (Frankfurt)', 
            status: 'On Time',
            altitude: '38,000 ft',
            speed: '560 knots',
            aircraft: 'Boeing 787',
            position: [41.98, -87.90] // ORD coordinates
        }
    };

    // Current flight marker
    let currentFlightMarker = null;

    // Show notification function
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }, 100);
    }

    // Update flight info panel
    function updateFlightInfo(flightNumber) {
        const flight = flightData[flightNumber];
        if (!flight) return;
        
        // Clear any existing aircraft row
        const existingAircraftRow = document.querySelector('.flight-info .aircraft-row');
        if (existingAircraftRow) {
            existingAircraftRow.remove();
        }
        
        // Update all fields
        document.querySelectorAll('.flight-row').forEach(row => {
            const label = row.querySelector('.label').textContent;
            if (label.includes('Flight')) row.querySelector('.value').textContent = flightNumber;
            if (label.includes('Airline')) row.querySelector('.value').textContent = flight.airline;
            if (label.includes('Departure')) row.querySelector('.value').textContent = flight.departure;
            if (label.includes('Arrival')) row.querySelector('.value').textContent = flight.arrival;
            if (label.includes('Status')) row.querySelector('.value').textContent = flight.status;
            if (label.includes('Altitude')) row.querySelector('.value').textContent = flight.altitude;
            if (label.includes('Speed')) row.querySelector('.value').textContent = flight.speed;
        });
        
        // Add aircraft info if available
        if (flight.aircraft) {
            const aircraftRow = document.createElement('div');
            aircraftRow.className = 'flight-row aircraft-row';
            aircraftRow.innerHTML = `
                <span class="label">Aircraft:</span>
                <span class="value">${flight.aircraft}</span>
            `;
            document.querySelector('.flight-info').appendChild(aircraftRow);
        }
        
        // Update map if position is available
        if (flight.position) {
            if (currentFlightMarker) {
                map.removeLayer(currentFlightMarker);
            }
            
            map.setView(flight.position, 6);
            currentFlightMarker = L.marker(flight.position)
                .addTo(map)
                .bindPopup(`Flight ${flightNumber}`)
                .openPopup();
        }
    }

    // Make flight info tags clickable
    document.querySelectorAll('.flight-row').forEach(row => {
        row.addEventListener('click', function() {
            const flightNumber = document.querySelector('.flight-info .value:nth-child(1)').textContent;
            if (flightNumber && flightData[flightNumber]) {
                showNotification(`Refreshing details for ${flightNumber}`);
                updateFlightInfo(flightNumber);
            }
        });
    });

    // Search functionality
    const flightSearch = document.getElementById('flightSearch');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    searchButton.addEventListener('click', () => {
        const searchTerm = flightSearch.value.trim().toUpperCase();
        
        if (searchTerm === '') {
            showNotification('Please enter a flight number', true);
            return;
        }

        if (flightData[searchTerm]) {
            showNotification(`Flight ${searchTerm} found!`);
            updateFlightInfo(searchTerm);
        } else {
            showNotification(`Flight ${searchTerm} not found. Try AB123, AB124, or AB125`, true);
        }
    });

    // Show suggestions when typing
    flightSearch.addEventListener('input', () => {
        const searchTerm = flightSearch.value.trim().toUpperCase();
        searchSuggestions.innerHTML = '';
        
        if (searchTerm.length > 1) {
            const matches = Object.keys(flightData)
                .filter(code => code.includes(searchTerm))
                .slice(0, 5);
            
            if (matches.length > 0) {
                searchSuggestions.style.display = 'block';
                matches.forEach(code => {
                    const suggestion = document.createElement('div');
                    suggestion.className = 'suggestion';
                    suggestion.textContent = `${code} - ${flightData[code].airline}`;
                    suggestion.addEventListener('click', () => {
                        flightSearch.value = code;
                        searchSuggestions.style.display = 'none';
                        searchButton.click();
                    });
                    searchSuggestions.appendChild(suggestion);
                });
            } else {
                searchSuggestions.style.display = 'none';
            }
        } else {
            searchSuggestions.style.display = 'none';
        }
    });

    // Hide suggestions when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchBar') && !e.target.closest('.search-wrapper')) {
            searchSuggestions.style.display = 'none';
        }
    });

    // Initialize with a default flight
    updateFlightInfo('AB123');
});

// Airplane Cards information API call.

// Airplane Cards information API call.

let offset = 0; // Offset for pagination (start at 0)
const limit = 50; // Initial number of results to load
const maxResults = 1000000; // The maximum number of results you want to load in total

// Function to fetch airplane data
function fetchData() {
  const query = `
    SELECT ?aircraft ?aircraftLabel ?manufacturerLabel ?firstFlight ?image ?wingspan ?speed ?engines ?engineTypeLabel ?range ?crew ?capacity ?countryLabel ?roleLabel
    WHERE {
      ?aircraft wdt:P31 wd:Q11436.
      OPTIONAL { ?aircraft wdt:P176 ?manufacturer. }
      OPTIONAL { ?aircraft wdt:P729 ?firstFlight. }
      OPTIONAL { ?aircraft wdt:P18 ?image. }
      OPTIONAL { ?aircraft wdt:P205 ?wingspan. }
      OPTIONAL { ?aircraft wdt:P2050 ?speed. }
      OPTIONAL { ?aircraft wdt:P2067 ?engines. }
      OPTIONAL { ?aircraft wdt:P516 ?engineType. }
      OPTIONAL { ?aircraft wdt:P2578 ?range. }
      OPTIONAL { ?aircraft wdt:P4129 ?crew. }
      OPTIONAL { ?aircraft wdt:P1083 ?capacity. }
      OPTIONAL { ?aircraft wdt:P495 ?country. }
      OPTIONAL { ?aircraft wdt:P279 ?role. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  const url = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(query);
  const headers = { "Accept": "application/sparql-results+json" };

  fetch(url, { headers })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('airplane-cards');
      const results = data.results.bindings;
      const airplanes = {};

      // Group airplanes by name and their engine variants
      results.forEach(item => {
        const get = (field, suffix = '') => item[field]?.value || suffix;

        const name = get('aircraftLabel');
        const manufacturer = get('manufacturerLabel', '');
        const role = get('roleLabel', '');
        const origin = get('countryLabel');
        const firstFlight = get('firstFlight');
        const crew = get('crew');
        const wingspan = get('wingspan');
        const speed = get('speed');
        const range = get('range');
        const engineType = get('engineTypeLabel');
        const engines = get('engines');
        const capacity = get('capacity');
        const image = get('image');

        // Skip if no image or it's the placeholder
        if (!image || image.includes('No-Image-Placeholder.svg')) return;

        // Extract the year of first flight (proxy for year built)
        const yearBuilt = firstFlight ? new Date(firstFlight).getFullYear() : '';

        // Create an airplane object if it doesn't exist yet
        if (!airplanes[name]) {
          airplanes[name] = {
            name: name,
            manufacturer: manufacturer,
            role: role,
            origin: origin,
            firstFlight: firstFlight,
            crew: crew,
            wingspan: wingspan,
            speed: speed,
            range: range,
            engineVariants: new Set(),
            capacity: capacity,
            image: image,
            yearBuilt: yearBuilt,
          };
        }

        // Add engine variant
        if (engineType) {
          airplanes[name].engineVariants.add(engineType);
        }
      });

      // Now, render each airplane as a separate card
      Object.values(airplanes).forEach(airplane => {
        const card = document.createElement('div');
        card.className = 'airplane-card';

        // Add data attributes for search/filter
        card.setAttribute('data-name', airplane.name.toLowerCase());
        card.setAttribute('data-manufacturer', airplane.manufacturer.toLowerCase());
        card.setAttribute('data-role', airplane.role.toLowerCase());

        let cardContent = `
          <img src="${airplane.image}" alt="${airplane.name}">
          <h2>${airplane.name}</h2>
        `;

        if (airplane.manufacturer !== '') cardContent += `<p><strong>Manufacturer:</strong> ${airplane.manufacturer}</p>`;
        if (airplane.origin !== '') cardContent += `<p><strong>Country:</strong> ${airplane.origin}</p>`;
        if (airplane.yearBuilt !== '') cardContent += `<p><strong>Year Built:</strong> ${airplane.yearBuilt}</p>`;
        if (airplane.role !== '') cardContent += `<p><strong>Role:</strong> ${airplane.role}</p>`;
        if (airplane.wingspan !== '') cardContent += `<p><strong>Wingspan:</strong> ${airplane.wingspan} m</p>`;
        if (airplane.speed !== '') cardContent += `<p><strong>Speed:</strong> ${airplane.speed} km/h</p>`;
        if (airplane.range !== '') cardContent += `<p><strong>Range:</strong> ${airplane.range} km</p>`;
        if (airplane.capacity !== '') cardContent += `<p><strong>Capacity:</strong> ${airplane.capacity}</p>`;
        if (airplane.crew !== '') cardContent += `<p><strong>Crew:</strong> ${airplane.crew}</p>`;

        if (airplane.engineVariants.size > 0) {
          cardContent += `<p><strong>Engine Variants:</strong></p><ul>`;
          airplane.engineVariants.forEach(engine => {
            cardContent += `<li>${engine}</li>`;
          });
          cardContent += `</ul>`;
        }

        card.innerHTML = cardContent;
        container.appendChild(card);
      });

      // Increment the offset for the next fetch
      offset += limit;
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      document.getElementById('airplane-cards').innerHTML = '<p>Failed to load data.</p>';
    });
}

// Load initial data
fetchData();

// Handle scroll event to load more data when the user reaches the bottom of the page
window.addEventListener('scroll', () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight - 200 && offset < maxResults) {
    fetchData();
  }
});



/// ATC Code:

const icaoInput = document.getElementById('icao-input');
const searchBtn = document.getElementById('search-btn');
const previewFrame = document.getElementById('liveatc-frame');
const overlay = document.getElementById('preview-overlay');
const launchButton = document.getElementById('launch-button');

// Create a popup window reference
let liveatcWindow = null;

// Function to load the preview
function loadLiveATCPreview(icao) {
    // Hide overlay when frame loads
    previewFrame.onload = () => overlay.classList.add('hidden');
    
    // Set the iframe source
    previewFrame.src = `https://www.liveatc.net/search/?icao=${icao}`;
    
    // Also open in a new window
    liveatcWindow = window.open(
        `https://www.liveatc.net/search/?icao=${icao}`,
        'LiveATC_Preview',
        'width=800,height=600,top=100,left=100'
    );
}

// Manual load button
launchButton.addEventListener('click', () => {
    loadLiveATCPreview(icaoInput.value.trim().toUpperCase());
});

// Search button
searchBtn.addEventListener('click', () => {
    const icao = icaoInput.value.trim().toUpperCase();
    if (icao) {
        loadLiveATCPreview(icao);
    }
});

// Handle popup window closing
setInterval(() => {
    if (liveatcWindow && liveatcWindow.closed) {
        overlay.classList.remove('hidden');
        previewFrame.src = '';
        liveatcWindow = null;
    }
}, 1000);