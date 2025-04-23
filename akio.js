
// AKIO

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

