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