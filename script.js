// Dummy lost items (initial state, will be updated dynamically)
let lostItems = [
  { 
      name: "Wallet", 
      image: "wallet.jpg", 
      finder: "John Doe", 
      contact: "john@example.com",
      claims: [] // Store claims as an array of objects
  },
  { 
      name: "Keys", 
      image: "keys.jpg", 
      finder: "Jane Smith", 
      contact: "jane@example.com",
      claims: [] // Store claims here as well
  }
];

// Banned words list
const bannedWords = ["badword1", "badword2", "inappropriate", "offensive"]; // Add more words here

// Function to check if a string contains any banned words
function containsBannedWords(input) {
  const lowercasedInput = input.toLowerCase();
  for (let word of bannedWords) {
      if (lowercasedInput.includes(word)) {
          return true;
      }
  }
  return false;
}

// Function to display items
function displayItems(items) {
  const grid = document.getElementById("items-grid");
  const noResultsMessage = document.getElementById("no-results-message");
  
  grid.innerHTML = ""; // Clear grid before adding items

  // If no items match, display a "No results" message
  if (items.length === 0) {
      noResultsMessage.style.display = "block"; // Show the "No results" message
      return;
  } else {
      noResultsMessage.style.display = "none"; // Hide the "No results" message
  }

  items.forEach(item => {
      const card = document.createElement("div");
      card.className = "item-card";
      
      // Get the claim count and last claimer name (if any)
      const claimCount = item.claims.length;
      const lastClaimant = claimCount > 0 ? item.claims[claimCount - 1].claimer : "No claims yet";

      card.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <div class="contact-info">
              <p>Found by: ${item.finder}</p>
              <p>Contact: ${item.contact}</p>
              <p><strong>Claim count: </strong>${claimCount}</p>
              <p><strong>Last Claimed by: </strong>${lastClaimant}</p>
              <button onclick="openClaimModal('${item.name}')">Claim this item</button>
          </div>
      `;
      grid.appendChild(card);
  });
}

// Initial display
displayItems(lostItems);

// Search Functionality
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = lostItems.filter(item => item.name.toLowerCase().includes(query));
  displayItems(filtered);
});

// Handle adding new lost item submission
document.getElementById("add-item-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  // Get the form data
  const name = document.getElementById("item-name").value;
  const finder = document.getElementById("finder-name").value;
  const contact = document.getElementById("finder-contact").value;
  const imageFile = document.getElementById("item-image").files[0];

  // Check if item name or finder's name contains banned words
  if (containsBannedWords(name) || containsBannedWords(finder)) {
      alert("Please avoid using inappropriate words in the item name or your name.");
      return;
  }

  // Validate input
  if (!name || !finder || !contact || !imageFile) {
      alert("Please fill in all fields!");
      return;
  }

  // Convert image to a data URL
  const reader = new FileReader();
  reader.onload = function (event) {
      const newItem = {
          name: name,
          image: event.target.result,  // Use the base64 image data
          finder: finder,
          contact: contact,
          claims: [] // Start with no claims
      };
      // Add new item to the lostItems array
      lostItems.push(newItem);
      // Update the display
      displayItems(lostItems);
      
      // Clear the form inputs after submission
      document.getElementById("add-item-form").reset();
  };
  reader.readAsDataURL(imageFile);
});

// Claim Modal Functionality
function openClaimModal(itemName) {
  const item = lostItems.find(item => item.name === itemName);
  
  // Show the modal
  document.getElementById("claim-modal").style.display = "block";
  
  document.getElementById("claim-form").onsubmit = function (e) {
      e.preventDefault();
      
      const claimerName = document.getElementById("owner-name").value;
      const claimerEmail = document.getElementById("owner-email").value;
      const claimDetails = document.getElementById("claim-details").value;
      
      // Add the claim to the item
      item.claims.push({
          claimer: claimerName,
          email: claimerEmail,
          details: claimDetails
      });

      // Close the modal and reset form
      document.getElementById("claim-modal").style.display = "none";
      document.getElementById("claim-form").reset();

      // Display claim confirmation
      showClaimConfirmation();

      // Update the display
      displayItems(lostItems);
  };
}

// Show the Claim Confirmation Modal
function showClaimConfirmation() {
  document.getElementById("claim-confirmation-modal").style.display = "block";
  
  // Close the modal after 5 seconds
  setTimeout(function () {
      document.getElementById("claim-confirmation-modal").style.display = "none";
  }, 10000);
}

// Close the claim modal
document.getElementById("close-modal").onclick = function () {
  document.getElementById("claim-modal").style.display = "none";
};

// Close the claim confirmation modal
document.getElementById("close-confirmation-modal").onclick = function () {
  document.getElementById("claim-confirmation-modal").style.display = "none";
};
