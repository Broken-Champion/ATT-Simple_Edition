const airplaneData = [
    {
      id: 1,
      name: "Boeing 737",
      manufacturer: "Boeing",
      role: "Commercial",
      image: "Public/imgs/airplanes/boeing737.png"
    },
    {
      id: 2,
      name: "F-22 Raptor",
      manufacturer: "Lockheed Martin",
      role: "Fighter",
      image: "Public/imgs/airplanes/f22.png"
    },
    {
      id: 3,
      name: "TKJ206",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/tkj206.png"
    },
    {
      id: 4,
      name: "Airbus A380",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/a380.png"
    },
    {
      id: 5,
      name: "Boeing 747",
      manufacturer: "Boeing",
      role: "Commercial",
      image: "Public/imgs/airplanes/boeing747.png"
    },
    {
      id: 6,
      name: "Concorde",
      manufacturer: "Aérospatiale/BAC",
      role: "Supersonic Passenger",
      image: "Public/imgs/airplanes/concorde.png"
    },
    {
      id: 7,
      name: "Cessna 172",
      manufacturer: "Cessna",
      role: "General Aviation",
      image: "Public/imgs/airplanes/cessna172.png"
    },
    {
      id: 8,
      name: "Lockheed C-130 Hercules",
      manufacturer: "Lockheed Martin",
      role: "Military Transport",
      image: "Public/imgs/airplanes/c130.png"
    },
    {
      id: 9,
      name: "McDonnell Douglas DC-10",
      manufacturer: "McDonnell Douglas",
      role: "Commercial",
      image: "Public/imgs/airplanes/dc10.png"
    },
    {
      id: 10,
      name: "Embraer E190",
      manufacturer: "Embraer",
      role: "Regional Jet",
      image: "Public/imgs/airplanes/e190.png"
    },
    {
      id: 11,
      name: "Sukhoi Su-27",
      manufacturer: "Sukhoi",
      role: "Fighter",
      image: "Public/imgs/airplanes/su27.png"
    },
    {
      id: 12,
      name: "Mikoyan MiG-29",
      manufacturer: "Mikoyan",
      role: "Fighter",
      image: "Public/imgs/airplanes/mig29.png"
    },
    {
      id: 13,
      name: "Eurofighter Typhoon",
      manufacturer: "Eurofighter GmbH",
      role: "Fighter",
      image: "Public/imgs/airplanes/typhoon.png"
    },
    {
      id: 14,
      name: "Boeing 787 Dreamliner",
      manufacturer: "Boeing",
      role: "Commercial",
      image: "Public/imgs/airplanes/boeing787.png"
    },
    {
      id: 15,
      name: "Airbus A350",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/a350.png"
    },
    {
      id: 16,
      name: "F-35 Lightning II",
      manufacturer: "Lockheed Martin",
      role: "Fighter",
      image: "Public/imgs/airplanes/f35.png"
    },
    {
      id: 17,
      name: "B-52 Stratofortress",
      manufacturer: "Boeing",
      role: "Bomber",
      image: "Public/imgs/airplanes/b52.png"
    },
    {
      id: 18,
      name: "F-16 Fighting Falcon",
      manufacturer: "General Dynamics",
      role: "Fighter",
      image: "Public/imgs/airplanes/f16.png"
    },
    {
      id: 19,
      name: "EgyptAir A330-300",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/330-300.png"
    },
    {
      id: 20,
      name: "EgyptAir B777-300",
      manufacturer: "Boeing",
      role: "Commercial",
      image: "Public/imgs/airplanes/777-200.png"
    },
    {
      id: 21,
      name: "EgyptAir B737-800",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/737-800.png"
    },
    {
      id: 22,
      name: "EgyptAir B787-9",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/319x144.png"
    },
    {
      id: 23,
      name: "EgyptAir AB320 Neo",
      manufacturer: "Airbus",
      role: "Commercial",
      image: "Public/imgs/airplanes/neo.png"
    },
    {
        id: 27,
        name: "Saudia Boeing 777-300ER",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/saudia_b777.png"
      },
      {
        id: 28,
        name: "Saudia Boeing 787-9",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/saudia_b787.png"
      },
      {
        id: 29,
        name: "Emirates Airbus A380",
        manufacturer: "Airbus",
        role: "Commercial",
        image: "Public/imgs/airplanes/emirates_a380.png"
      },
      {
        id: 30,
        name: "Emirates Boeing 777-300ER",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/emirates_b777.png"
      },
      {
        id: 31,
        name: "Etihad Airways Boeing 787-9",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/etihad_b787.png"
      },
      {
        id: 32,
        name: "Etihad Airways Airbus A350-1000",
        manufacturer: "Airbus",
        role: "Commercial",
        image: "Public/imgs/airplanes/etihad_a350.png"
      },
      {
        id: 33,
        name: "Lufthansa Airbus A350-900",
        manufacturer: "Airbus",
        role: "Commercial",
        image: "Public/imgs/airplanes/lufthansa_a350.png"
      },
      {
        id: 34,
        name: "Lufthansa Boeing 747-8",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/lufthansa_b747.png"
      },
      {
        id: 35,
        name: "United Airlines Boeing 787-10",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/united_b787.png"
      },
      {
        id: 36,
        name: "United Airlines Boeing 737 MAX 9",
        manufacturer: "Boeing",
        role: "Commercial",
        image: "Public/imgs/airplanes/united_b737max.png"
      }
  ];
  
  
  const cardContainer = document.getElementById("airplane-cards");
  const searchInput = document.getElementById("airplanesearch");
  
  function renderAirplaneCards(data) {
    cardContainer.innerHTML = "";
    if (data.length === 0) {
      cardContainer.innerHTML = "<p style='color:white;'>No airplanes found.</p>";
      return;
    }
  
    data.forEach((plane) => {
      const card = document.createElement("div");
      card.className = "airplane-card";
      card.innerHTML = `
        <img src="${plane.image}" alt="${plane.name}" class="airplane-img"/>
        <div class="airplane-info">
          <h3><i class="fas fa-plane"></i> ${plane.name}</h3>
          <p><i class="fas fa-industry"></i> Manufacturer: ${plane.manufacturer}</p>
          <p><i class="fas fa-tag"></i> Role: ${plane.role}</p>
        </div>
      `;
      card.addEventListener("click", (e) => showDetails(plane, e.currentTarget));
      cardContainer.appendChild(card);
    });
  }
  
  function showDetails(plane, targetElement) {
    // Remove existing floating cards
    const existing = document.querySelector(".floating-info-card");
    if (existing) existing.remove();
  
    const rect = targetElement.getBoundingClientRect();
  
    const infoCard = document.createElement("div");
    infoCard.className = "floating-info-card";
    infoCard.innerHTML = `
      <span class="close-btn">&times;</span>
      <h2>${plane.name}</h2>
      <img src="${plane.image}" alt="${plane.name}" style="width:100%; border-radius:10px; margin-bottom:1rem;">
      <p><strong>Manufacturer:</strong> ${plane.manufacturer}</p>
      <p><strong>Role:</strong> ${plane.role}</p>
    `;
  
    document.body.appendChild(infoCard);
  
    // Position near clicked card
    infoCard.style.position = "absolute";
    infoCard.style.left = `${rect.left + window.scrollX + rect.width + 10}px`;
    infoCard.style.top = `${rect.top + window.scrollY}px`;
  
    // Flip to left side if it overflows
    const infoCardRect = infoCard.getBoundingClientRect();
    if (infoCardRect.right > window.innerWidth) {
      infoCard.style.left = `${rect.left + window.scrollX - infoCard.offsetWidth - 10}px`;
    }
  
    // Close button
    infoCard.querySelector(".close-btn").onclick = () => infoCard.remove();
  }
  
  
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = airplaneData.filter((plane) =>
      plane.name.toLowerCase().includes(query)
    );
    renderAirplaneCards(filtered);
  }
  
  searchInput.addEventListener("input", handleSearch);
  renderAirplaneCards(airplaneData);