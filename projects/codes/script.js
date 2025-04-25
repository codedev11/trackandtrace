// Load from localStorage or use default items
let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [
  {
    name: "Wallet found at park avenue 1/3",
    image: "wallet1.jpg",
    finder: "John Doe",
    contact: "john@gmail.com",
    claims: []
  },
  {
    name: "Keys found at street 1 block 3",
    image: "keys1.jpg",
    finder: "Jane Smith",
    contact: "jane@gmail.com",
    claims: []
  }
];

// Banned words list
const bannedWords = ["badword1", "badword2", "inappropriate", "offensive"];

// Function to check for banned words
function containsBannedWords(input) {
  const lowercasedInput = input.toLowerCase();
  return bannedWords.some(word => lowercasedInput.includes(word));
}

// Save items to localStorage
function saveItems() {
  localStorage.setItem("lostItems", JSON.stringify(lostItems));
}

// Display items
function displayItems(items) {
  const grid = document.getElementById("items-grid");
  const noResultsMessage = document.getElementById("no-results-message");

  grid.innerHTML = "";

  if (items.length === 0) {
    noResultsMessage.style.display = "block";
    return;
  } else {
    noResultsMessage.style.display = "none";
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

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

// Search functionality
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = lostItems.filter(item => item.name.toLowerCase().includes(query));
  displayItems(filtered);
});

// Handle new lost item submission
document.getElementById("add-item-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("item-name").value;
  const finder = document.getElementById("finder-name").value;
  const contact = document.getElementById("finder-contact").value;
  const imageFile = document.getElementById("item-image").files[0];

  if (containsBannedWords(name) || containsBannedWords(finder)) {
    alert("Please avoid using inappropriate words.");
    return;
  }

  if (!name || !finder || !contact || !imageFile) {
    alert("Please fill in all fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const newItem = {
      name: name,
      image: event.target.result,
      finder: finder,
      contact: contact,
      claims: []
    };

    lostItems.push(newItem);
    saveItems(); // Save to localStorage
    displayItems(lostItems);
    document.getElementById("add-item-form").reset();
  };
  reader.readAsDataURL(imageFile);
});

// Claim modal functionality
function openClaimModal(itemName) {
  const item = lostItems.find(item => item.name === itemName);
  document.getElementById("claim-modal").style.display = "block";

  document.getElementById("claim-form").onsubmit = function (e) {
    e.preventDefault();

    const claimerName = document.getElementById("owner-name").value;
    const claimerEmail = document.getElementById("owner-email").value;
    const claimDetails = document.getElementById("claim-details").value;

    item.claims.push({
      claimer: claimerName,
      email: claimerEmail,
      details: claimDetails
    });

    document.getElementById("claim-modal").style.display = "none";
    document.getElementById("claim-form").reset();
    showClaimConfirmation();
    saveItems(); // Save updated claims
    displayItems(lostItems);
  };
}

// Claim confirmation modal
function showClaimConfirmation() {
  const modal = document.getElementById("claim-confirmation-modal");
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.display = "none";
  }, 10000);
}

// Close modals
document.getElementById("close-modal").onclick = () => {
  document.getElementById("claim-modal").style.display = "none";
};
document.getElementById("close-confirmation-modal").onclick = () => {
  document.getElementById("claim-confirmation-modal").style.display = "none";
};
// Reset button functionality
document.getElementById("reset-button").addEventListener("click", function () {
  const confirmReset = confirm("Are you sure you want to delete all saved items and reset the page?");
  if (confirmReset) {
    localStorage.removeItem("lostItems"); // Clear saved data
    location.reload(); // Reload the page
  }
});
