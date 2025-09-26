const apiURL = "http://localhost:3000/properties"; //API from JSON

//My buttons
const buyBtn = document.getElementById("show-buy");
const rentBtn = document.getElementById("show-rent");
const favBtn = document.getElementById("show-favourites");

//My <li> of properties
const forSale = document.getElementById("buy-list");
const forRent = document.getElementById("rent-list");
const favourites = document.getElementById("favourites-list");

// Hide sections untill someone clicks it
forSale.style.display = "none";
forRent.style.display = "none";
favourites.style.display = "none";

// Store all fetched properties
let allProperties = [];

//creates property function
function createPropertyCard(property) {
  const card = document.createElement("div");
  card.classList.add("property-card"); //adds a css section for styling

  //inserts html content to the card
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

  const favBtn = card.querySelector(".fav-btn"); //find btn inside card
  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation(); //prevents clicking from affecting the card
      property.isFavourite = !property.isFavourite; //true or false
      favBtn.textContent = property.isFavourite ? "💖" : "♡"; //updates icons
      updateFavourite(property); //updates fav section
    });
  }

  card.addEventListener("mouseover", () => {
    //creates hover effect
    card.style.backgroundColor = "#dee1e3ff"; //changes color when hovered
    card.style.cursor = "pointer"; //shows pointer icon
  });

  card.addEventListener("mouseout", () => {
    card.style.backgroundColor = "#fff"; //resets color when hovered
    card.style.cursor = "default";
  });

  return card; //sends the finished cards
}

function updateFavourite(property) {
  //updates fav section
  if (property.isFavourite) {
    //adds and removes cards from favs list
    const exists = [...favourites.querySelectorAll("h3")].some(
      //checks if property is in favs
      (h3) => h3.textContent === property.title
    );
    if (!exists) favourites.appendChild(createPropertyCard(property)); //if not already there add it
  } else {
    favourites.querySelectorAll(".property-card").forEach((card) => {
      //if unfav remove it
      if (card.querySelector("h3").textContent === property.title) {
        card.remove();
      }
    });
  }
}

// fetch all properties from JSON
function fetchProperties() {
  fetch(apiURL) //makes request to server
    .then((res) => res.json()) //converts a response
    .then((data) => {
      // the API returns the properties from JSON
      allProperties = data.properties || data;
      //goes through the properties and puts it in place
      allProperties.forEach((property) => {
        if (property.type === "buy")
          forSale.appendChild(createPropertyCard(property));
        if (property.type === "rent")
          forRent.appendChild(createPropertyCard(property));
        if (property.isFavourite)
          favourites.appendChild(createPropertyCard(property));
      });
    })
    .catch((err) => console.error("Error fetching properties:", err)); //catches error
}

// calls fetch on page load
fetchProperties();

//btn even litsenters ,it shows or hides sections when each button is clicked
buyBtn.addEventListener("click", () => {
  forSale.style.display = forSale.style.display === "none" ? "grid" : "none";
});

rentBtn.addEventListener("click", () => {
  forRent.style.display = forRent.style.display === "none" ? "grid" : "none";
});

favBtn.addEventListener("click", () => {
  favourites.style.display =
    favourites.style.display === "none" ? "grid" : "none";
});
