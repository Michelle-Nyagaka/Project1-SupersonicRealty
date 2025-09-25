const apiURL = "http://localhost:3000/properties";

const buyBtn = document.getElementById("show-buy");
const rentBtn = document.getElementById("show-rent");
const favBtn = document.getElementById("show-favourites");

const forSale = document.getElementById("buy-list");
const forRent = document.getElementById("rent-list");
const favourites = document.getElementById("favourites-list");

// Hide sections initially
forSale.style.display = "none";
forRent.style.display = "none";
favourites.style.display = "none";

// Store all fetched properties
let allProperties = [];

function createPropertyCard(property) {
  const card = document.createElement("div");
  card.classList.add("property-card");

  card.innerHTML = `
    <img src="${property.imageUrl || property.images?.[0] || ""}" 
         alt="${property.title}" 
         class="property-img" />
    <h3>${property.title}</h3>
    <p>Price: ${property.price}</p>
    <p>Location: ${property.location}</p>
    <p>Bedrooms: ${property.bedrooms || "N/A"}</p>
    <p>Bathrooms: ${property.bathrooms || "N/A"}</p>
    <button class="fav-btn">${property.isFavourite ? "💖" : "♡"}</button>
  `;

  const favBtn = card.querySelector(".fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      property.isFavourite = !property.isFavourite;
      favBtn.textContent = property.isFavourite ? "💖" : "♡";
      updateFavourite(property);
    });
  }

  card.addEventListener("mouseover", () => {
    card.style.backgroundColor = "#dee1e3ff";
    card.style.cursor = "pointer";
  });

  card.addEventListener("mouseout", () => {
    card.style.backgroundColor = "#fff";
    card.style.cursor = "default";
  });

  return card;
}

function updateFavourite(property) {
  if (property.isFavourite) {
    const exists = [...favourites.querySelectorAll("h3")].some(
      (h3) => h3.textContent === property.title
    );
    if (!exists) favourites.appendChild(createPropertyCard(property));
  } else {
    favourites.querySelectorAll(".property-card").forEach((card) => {
      if (card.querySelector("h3").textContent === property.title) {
        card.remove();
      }
    });
  }
}

// Fetch all properties once on page load
function fetchProperties() {
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      // Adjust this depending on your JSON structure
      allProperties = data.properties || data;

      allProperties.forEach((property) => {
        if (property.type === "buy") forSale.appendChild(createPropertyCard(property));
        if (property.type === "rent") forRent.appendChild(createPropertyCard(property));
        if (property.isFavourite) favourites.appendChild(createPropertyCard(property));
      });
    })
    .catch((err) => console.error("Error fetching properties:", err));
}

// Call fetch on page load
fetchProperties();

// Toggle sections on button click
buyBtn.addEventListener("click", () => {
  forSale.style.display = forSale.style.display === "none" ? "grid" : "none";
});

rentBtn.addEventListener("click", () => {
  forRent.style.display = forRent.style.display === "none" ? "grid" : "none";
});

favBtn.addEventListener("click", () => {
  favourites.style.display = favourites.style.display === "none" ? "grid" : "none";
});

