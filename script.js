// Helper: Show page
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    if (page.id === pageId) {
      page.classList.add("active");
      window.scrollTo({ top: 0 });
    } else {
      page.classList.remove("active");
    }
  });
}

// Modal used ONLY for registration errors now
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalClose = document.getElementById("modalClose");

function openModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Global data
let storedName = "";
let storedDestination = "";
let storedTotal = 0;
let storedSelectionsText = "";

// PAGE 1 — Registration
const registrationForm = document.getElementById("registrationForm");

function validateRegistrationForm() {
  let valid = true;

  const name = document.getElementById("fullName");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const pincode = document.getElementById("pincode");

  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input").forEach((inp) => inp.classList.remove("invalid"));

  if (!name.value.trim()) {
    showError(name, "Enter your name");
    valid = false;
  }

  if (!/^\d{10}$/.test(phone.value.trim())) {
    showError(phone, "Phone must be 10 digits");
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "Invalid email");
    valid = false;
  }

  if (!/^\d{6}$/.test(pincode.value.trim())) {
    showError(pincode, "PIN must be 6 digits");
    valid = false;
  }

  if (valid) storedName = name.value.trim();
  return valid;
}

function showError(input, msg) {
  input.classList.add("invalid");
  input.closest(".form-group").querySelector(".error-message").textContent = msg;
}

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (validateRegistrationForm()) {
    showPage("page2"); // Now directly navigate instead of modal
  } else {
    openModal("Fix Required", "Please correct highlighted fields before continuing.");
  }
});

// PAGE 2 — Select destination (NEW)
document.querySelectorAll(".destination button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parent = e.target.closest(".destination");
    storedDestination = parent.querySelector("h1").textContent.trim();
    showPage("page3");
  });
});

// PAGE 3 — Calculator
const totalAmountSpan = document.getElementById("totalAmount");

function calculateTotal() {
  let total = 0;
  let selections = [];

  document.querySelectorAll("[data-price]").forEach((input) => {
    const price = parseInt(input.getAttribute("data-price"));
    if (input.checked) {
      total += price;
      selections.push(input.closest("label").textContent.trim());
    }
  });

  storedTotal = total;
  storedSelectionsText = selections.join("\n");
  totalAmountSpan.textContent = "₹" + total;
}

document.querySelectorAll("[data-price]").forEach((el) =>
  el.addEventListener("change", calculateTotal)
);

calculateTotal();

// Confirm trip (NO POPUP ANYMORE)
document.getElementById("confirmTrip").addEventListener("click", () => {
  updateSummaryPage();
  showPage("page4");
});

// PAGE 4 — Summary
function updateSummaryPage() {
  document.getElementById("summaryText").textContent =
    `Thanks ${storedName}! Your ${storedDestination} trip budget is ₹${storedTotal}.`;

  document.getElementById("receiptDetails").textContent =
    storedSelectionsText || "No additional activities selected";
}

// Restart site
document.getElementById("startOver").addEventListener("click", () => {
  registrationForm.reset();
  storedName = "";
  storedDestination = "";
  storedTotal = 0;
  document.querySelectorAll("[data-price]").forEach((inp) => (inp.checked = false));
  calculateTotal();
  showPage("page1");
});

// Always start on Page 1
showPage("page1");
