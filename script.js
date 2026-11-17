
// ========================================
// RESTART PRODUCTION HOUSE
// MAIN JAVASCRIPT
// ========================================


// ========================================
// CINEMATIC PAGE LOADER + SOUND
// ========================================

const loader = document.getElementById("loader");

const loaderSound = new Audio("public/audio/loading.mp3");

loaderSound.preload = "auto";
loaderSound.volume = 0.55;

let loaderSoundStarted = false;

function playLoaderSound() {
  if (loaderSoundStarted) return;

  loaderSoundStarted = true;
  loaderSound.currentTime = 0;

  loaderSound.play().catch((error) => {
    console.warn("Loading sound could not play:", error);
    loaderSoundStarted = false;
  });
}

// Play sound on the user's first interaction
function startLoaderSoundOnInteraction() {
  if (loaderSoundStarted) return;

  playLoaderSound();

  window.removeEventListener("pointerdown", startLoaderSoundOnInteraction);
  window.removeEventListener("keydown", startLoaderSoundOnInteraction);
}

window.addEventListener("pointerdown", startLoaderSoundOnInteraction);
window.addEventListener("keydown", startLoaderSoundOnInteraction);

// Hide loader after animation
window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 3200);
  }
});


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const isOpen = navMenu.classList.contains("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

  });

  document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {

      navMenu.classList.remove("open");

      menuToggle.textContent = "☰";

      menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

    });

  });

}


// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.getElementById("navbar");

if (navbar) {

  window.addEventListener("scroll", () => {

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 50
    );

  }, { passive: true });

}


// ========================================
// REPEATING SCROLL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }

  });

}, {
  threshold: 0.15
});

revealElements.forEach(element => {
  observer.observe(element);
});


// ========================================
// STUDIO MAP
// REPEATING ZOOM-IN ON SCROLL
// ========================================

const studioMapElement = document.getElementById("studioMap");
const mapZoomOverlay = document.getElementById("mapZoomOverlay");

if (studioMapElement && window.L) {

  const studioLocation = [
    29.403403123783523,
    76.9937612137467
  ];

  const startingZoom = 12;
  const studioZoom = 18;

  const studioMap = L.map("studioMap", {
    zoomControl: true,
    scrollWheelZoom: false,
    zoomAnimation: true,
    fadeAnimation: true
  }).setView(studioLocation, startingZoom);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  ).addTo(studioMap);

  const studioIcon = L.divIcon({
    className: "studio-marker-container",
    html: '<div class="studio-marker"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const studioMarker = L.marker(studioLocation, {
    icon: studioIcon
  }).addTo(studioMap);

  studioMarker.bindPopup(`
    <div class="studio-popup">
      <strong>RESTART PRODUCTION HOUSE</strong><br>
      Our Studio<br>
      Panipat, Haryana, India
    </div>
  `);

  let mapInitialized = false;
  let mapZoomTimer;

  function resetStudioMap() {

    clearTimeout(mapZoomTimer);

    studioMap.stop();
    studioMap.closePopup();

    studioMap.setView(
      studioLocation,
      startingZoom,
      { animate: false }
    );

  }

  function zoomIntoStudio() {

    if (!mapInitialized) {

      studioMap.invalidateSize();

      mapInitialized = true;

    }

    studioMap.stop();

    if (mapZoomOverlay) {

      mapZoomOverlay.classList.add("active");

      setTimeout(() => {
        mapZoomOverlay.classList.remove("active");
      }, 500);

    }

    studioMap.setView(
      studioLocation,
      startingZoom,
      { animate: false }
    );

    mapZoomTimer = setTimeout(() => {

      studioMap.flyTo(
        studioLocation,
        studioZoom,
        {
          animate: true,
          duration: 2.5,
          easeLinearity: 0.25
        }
      );

    }, 150);

  }

  const studioSection = document.getElementById("studio");

  if (studioSection) {

    const studioMapObserver = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          zoomIntoStudio();
        } else {
          resetStudioMap();
        }

      });

    }, {
      threshold: 0.35
    });

    studioMapObserver.observe(studioSection);

  }

}


// ========================================
// FOOTER CURRENT YEAR
// ========================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ========================================
// WHATSAPP BOOKING SYSTEM
// ========================================

// Replace with your studio WhatsApp number.
// Example: 919876543210
// Do not add +, spaces or dashes.

const STUDIO_WHATSAPP = "91XXXXXXXXXX";

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

  bookingForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = document
      .getElementById("customerName")
      .value.trim();

    const phone = document
      .getElementById("customerPhone")
      .value.trim();

    const service = document
      .getElementById("customerService")
      .value;

    const message = document
      .getElementById("customerMessage")
      .value.trim();


    // VALIDATION

    if (!name || !phone || !service) {

      alert("Please fill in all required fields.");

      return;

    }


    // PHONE NUMBER VALIDATION

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {

      alert("Please enter a valid phone number.");

      return;

    }


    // CHECK STUDIO WHATSAPP NUMBER

    if (!/^[0-9]{10,15}$/.test(STUDIO_WHATSAPP)) {

      alert(
        "Please add your studio WhatsApp number in script.js first."
      );

      return;

    }


    // WHATSAPP MESSAGE

    const whatsappMessage = `
Hello RESTART PRODUCTION HOUSE!

I want to enquire about booking.

Name: ${name}

Phone: ${phone}

Service: ${service}

Project Details: ${message || "Not provided"}

Please share the details and pricing.

Thank you!
`;


    // CREATE WHATSAPP URL

    const whatsappURL =
      "https://wa.me/" +
      STUDIO_WHATSAPP +
      "?text=" +
      encodeURIComponent(whatsappMessage);


    // OPEN WHATSAPP

    window.open(whatsappURL, "_blank");

  });

}
