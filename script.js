// This file contains all the JavaScript logic for the website
// Using standard JavaScript without JSX syntax

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all dropdowns
  const dropdownToggle = document.querySelector(".dropdown-toggle-custom");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Manual toggle for dropdown if needed (Bootstrap should handle this automatically)
  if (dropdownToggle && !window.bootstrap) {
    dropdownToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !dropdownToggle.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile dropdown menu if open
        if (dropdownMenu.classList.contains("show")) {
          dropdownMenu.classList.remove("show");
        }
      }
    });
  });

  // CTA button click handler
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      // You can add custom logic here, like opening a form or redirecting
      alert("Thank you for your interest! We will contact you shortly.");
    });
  }

  // Feature card animations
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.05)";
    });
  });

  // Affiliation images hover effect
  const affiliationImages = document.querySelectorAll(".affiliation-image");
  affiliationImages.forEach((image) => {
    image.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    image.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Pause affiliation slider on hover
  const affiliationTrack = document.querySelector(".affiliation-track");
  if (affiliationTrack) {
    affiliationTrack.addEventListener("mouseenter", function () {
      this.style.animationPlayState = "paused";
    });

    affiliationTrack.addEventListener("mouseleave", function () {
      this.style.animationPlayState = "running";
    });
  }

  // Carousel initialization (Bootstrap should handle this automatically)
  const carousel = document.getElementById("mainCarousel");
  if (carousel && !window.bootstrap) {
    // Simple carousel functionality if Bootstrap is not loaded
    const items = carousel.querySelectorAll(".carousel-item");
    const indicators = carousel.querySelectorAll(".carousel-indicators button");
    const prevButton = carousel.querySelector(".carousel-control-prev");
    const nextButton = carousel.querySelector(".carousel-control-next");
    let currentIndex = 0;

    function showSlide(index) {
      items.forEach((item, i) => {
        item.classList.remove("active");
        if (i === index) item.classList.add("active");
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.remove("active");
        if (i === index) indicator.classList.add("active");
      });

      currentIndex = index;
    }

    indicators.forEach((indicator, i) => {
      indicator.addEventListener("click", () => showSlide(i));
    });

    prevButton.addEventListener("click", () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = items.length - 1;
      showSlide(newIndex);
    });

    nextButton.addEventListener("click", () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= items.length) newIndex = 0;
      showSlide(newIndex);
    });

    // Auto-slide functionality
    setInterval(() => {
      let newIndex = currentIndex + 1;
      if (newIndex >= items.length) newIndex = 0;
      showSlide(newIndex);
    }, 5000);
  }

  // Add active class to nav items based on scroll position
  function updateActiveNavItem() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.pageYOffset + 100; // Offset for navbar height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document
          .querySelector(`.navbar a[href="#${sectionId}"]`)
          ?.classList.add("active");
      } else {
        document
          .querySelector(`.navbar a[href="#${sectionId}"]`)
          ?.classList.remove("active");
      }
    });
  }

  // Update active nav item on scroll
  window.addEventListener("scroll", updateActiveNavItem);
});

// Responsive navbar handling
window.addEventListener("resize", () => {
  const navbar = document.querySelector(".navbar");
  if (window.innerWidth < 992) {
    navbar.classList.add("navbar-light");
  } else {
    navbar.classList.remove("navbar-light");
  }
});

// Initialize any components that need JavaScript on page load
window.addEventListener("load", () => {
  // You can add any initialization code here
  console.log("Website loaded successfully!");
});
