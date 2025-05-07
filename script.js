document.addEventListener("DOMContentLoaded", function () {
  // Lazy load images
  const lazyImages = document.querySelectorAll(
    ".gallery-image, .service-image"
  );

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");

            if (src) {
              img.src = src;
              img.classList.add("in-view");
              img.removeAttribute("data-src");
            }

            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    lazyImages.forEach((img) => {
      // Store original src in data-src attribute
      if (!img.getAttribute("data-src")) {
        img.setAttribute("data-src", img.src);
        // Use a small placeholder initially
        img.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
      imageObserver.observe(img);
    });
  }

  // Optimize animations
  const serviceItems = document.querySelectorAll(".service-item");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const elementsToAnimate = [...serviceItems, ...galleryCards];

  if ("IntersectionObserver" in window) {
    const animationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // Stop observing after animation is triggered
            animationObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    elementsToAnimate.forEach((element) => {
      animationObserver.observe(element);
    });
  }

  // Optimize affiliation slider animation
  const affiliationTrack = document.querySelector(".affiliation-track");
  if (affiliationTrack) {
    // Pause animation when not in viewport to save resources
    const sliderObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            affiliationTrack.style.animationPlayState = "running";
          } else {
            affiliationTrack.style.animationPlayState = "paused";
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      }
    );

    sliderObserver.observe(affiliationTrack);
  }

  // Testimonial Slider - Updated for client requirements
  const testimonialsTrack = document.querySelector(".testimonials-track");
  if (testimonialsTrack) {
    let startX;
    let startY;
    let currentTranslate = 0;
    let isDragging = false;
    let currentIndex = 0;
    const slides = document.querySelectorAll(".testimonial-slide");
    const slideCount = slides.length;

    // Calculate how many slides to show at once based on screen width
    function getSlidesPerView() {
      if (window.innerWidth >= 1200) {
        return 5; // Desktop: Show 5 testimonials
      } else if (window.innerWidth >= 768) {
        return 3; // Tablet: Show 3 testimonials
      } else {
        return 1.5; // Mobile: Show 1.5 testimonials (one full and half of another)
      }
    }

    // Calculate slide width based on how many should be visible
    function getSlideWidth() {
      return 100 / getSlidesPerView();
    }

    // Set initial widths for all slides
    function setSlideWidths() {
      const slideWidth = getSlideWidth();
      slides.forEach((slide) => {
        slide.style.minWidth = `${slideWidth}%`;
        slide.style.flex = `0 0 ${slideWidth}%`;
      });
    }

    // Update slider position
    function updateSliderPosition() {
      const slidesPerView = getSlidesPerView();
      const maxIndex = slideCount - Math.floor(slidesPerView);

      // Prevent sliding past the last slide
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      // Calculate percentage to translate
      const translatePercentage = -(currentIndex * getSlideWidth());
      testimonialsTrack.style.transform = `translateX(${translatePercentage}%)`;
    }

    // Touch events
    testimonialsTrack.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    testimonialsTrack.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // If the movement is more vertical than horizontal, allow normal scrolling
        if (Math.abs(diffY) > Math.abs(diffX)) {
          return;
        }

        // Only prevent default for horizontal movements
        if (Math.abs(diffX) > 5) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    testimonialsTrack.addEventListener("touchend", (e) => {
      if (!isDragging) return;

      const currentX = e.changedTouches[0].clientX;
      const currentY = e.changedTouches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Only handle horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY)) {
        const threshold = 50; // minimum distance to trigger slide change

        if (diffX < -threshold) {
          // Swipe left - next slide
          currentIndex += 1;
        } else if (diffX > threshold) {
          // Swipe right - previous slide
          currentIndex -= 1;
        }
        updateSliderPosition();
      }

      isDragging = false;
    });

    // Mouse events for desktop
    testimonialsTrack.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
      testimonialsTrack.style.cursor = "grabbing";

      // Prevent default drag behavior
      e.preventDefault();
    });

    testimonialsTrack.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
    });

    testimonialsTrack.addEventListener("mouseup", (e) => {
      if (!isDragging) return;

      const currentX = e.clientX;
      const diff = currentX - startX;

      // Determine if we should move to the next or previous slide
      const threshold = 50;

      if (diff < -threshold) {
        // Swipe left - next slide
        currentIndex += 1;
      } else if (diff > threshold) {
        // Swipe right - previous slide
        currentIndex -= 1;
      }

      updateSliderPosition();
      isDragging = false;
      testimonialsTrack.style.cursor = "grab";
    });

    testimonialsTrack.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        testimonialsTrack.style.cursor = "grab";
      }
    });

    // Initialize slider
    testimonialsTrack.style.cursor = "grab";
    setSlideWidths();

    // Handle window resize
    window.addEventListener("resize", () => {
      setSlideWidths();
      updateSliderPosition();
    });

    // Initial position
    updateSliderPosition();
  }

  // Officials section optimization
  const officialsTrack = document.querySelector(".officials-track");
  if (officialsTrack) {
    // Pause animation when not in viewport to save resources
    const officialsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            officialsTrack.style.animationPlayState = "running";
          } else {
            officialsTrack.style.animationPlayState = "paused";
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      }
    );

    officialsObserver.observe(officialsTrack);

    // Lazy load official images
    const officialImages = document.querySelectorAll(".official-image");
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );

    officialImages.forEach((img) => {
      if (!img.getAttribute("data-src")) {
        img.setAttribute("data-src", img.src);
        img.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
      imageObserver.observe(img);
    });
  }

  // Mobile Get Started button scroll and animation
  const getStartedBtn = document.getElementById("mobileGetStartedBtn");
  const featuresSection = document.getElementById("get-started");

  if (getStartedBtn && featuresSection) {
    getStartedBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Scroll to features section smoothly
      featuresSection.scrollIntoView({ behavior: "smooth" });

      // Animate each get-started-box border one by one
      const boxes = featuresSection.querySelectorAll(".get-started-box");
      let i = 0;
      function animateBox() {
        if (i > 0) {
          boxes[i - 1].classList.remove("feature-animate-border");
        }
        if (i < boxes.length) {
          boxes[i].classList.add("feature-animate-border");
          setTimeout(() => {
            i++;
            animateBox();
          }, 350); // Duration for each border
        } else {
          // Remove the border after a short delay and restore original
          setTimeout(() => {
            boxes.forEach((box) =>
              box.classList.remove("feature-animate-border")
            );
          }, 500);
        }
      }
      animateBox();
    });
  }
});

// Add this code to your script.js file, after th' existing DOMCon'entLoaded event listener code

// Affiliation slider with active state and controlled movement
function initAffiliationSlider() {
  const affiliationTrack = document.querySelector(".affiliation-track");
  const affiliationSlides = document.querySelectorAll(".affiliation-slide");

  if (!affiliationTrack || affiliationSlides.length === 0) return;

  // Set initial state
  let currentIndex = 0;
  const slideCount = affiliationSlides.length;
  const visibleSlides = getVisibleSlides();
  let autoplayInterval;

  // Determine how many slides should be visible based on screen width
  function getVisibleSlides() {
    return window.innerWidth < 768 ? 2 : 4;
  }

  // Update which slides are active
  function updateActiveStates() {
    affiliationSlides.forEach((slide, index) => {
      // Calculate if this slide should be active (centered in view)
      const isActive =
        index >= currentIndex && index < currentIndex + visibleSlides;
      slide.classList.toggle("active", isActive);
    });

    // Update the transform to position the track
    const slideWidth = affiliationSlides[0].offsetWidth;
    const gapWidth = parseInt(
      window.getComputedStyle(affiliationTrack).columnGap || 40
    );
    const translateX = -(currentIndex * (slideWidth + gapWidth));
    affiliationTrack.style.transform = `translateX(${translateX}px)`;
  }

  // Move to the next slide
  function moveNext() {
    currentIndex = (currentIndex + 1) % (slideCount - visibleSlides + 1);
    updateActiveStates();
  }

  // Start autoplay
  function startAutoplay() {
    stopAutoplay(); // Clear any existing interval
    autoplayInterval = setInterval(moveNext, 2000); // Change slide every 2 seconds
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    const newVisibleSlides = getVisibleSlides();
    if (newVisibleSlides !== visibleSlides) {
      // Update visible slides count
      visibleSlides = newVisibleSlides;
      // Ensure currentIndex is valid with new visible slides count
      if (currentIndex > slideCount - visibleSlides) {
        currentIndex = slideCount - visibleSlides;
      }
      updateActiveStates();
    }
  });

  // Pause on hover
  affiliationTrack.addEventListener("mouseenter", stopAutoplay);
  affiliationTrack.addEventListener("mouseleave", startAutoplay);

  // Start the autoplay
  startAutoplay();

  // Add touch/swipe support
  let startX,
    isDragging = false;

  affiliationTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  });

  affiliationTrack.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;

      // Prevent default to stop page scrolling while swiping
      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  affiliationTrack.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    const currentX = e.changedTouches[0].clientX;
    const diff = currentX - startX;

    // Determine if we should move to the next or previous slide
    const threshold = 50; // minimum distance to trigger slide change

    if (diff < -threshold) {
      // Swipe left - next slide
      currentIndex = Math.min(currentIndex + 1, slideCount - visibleSlides);
    } else if (diff > threshold) {
      // Swipe right - previous slide
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateActiveStates();
    isDragging = false;
    startAutoplay();
  });
}

// Call the function to initialize the affiliation slider
document.addEventListener("DOMContentLoaded", function () {
  // Existing code...

  // Initialize the affiliation slider
  initAffiliationSlider();
});

// Media Image Modal functionality
window.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("mediaImageModal");
  const modalImg = document.getElementById("mediaModalImg");
  const closeBtn = document.querySelector(".media-modal-close");
  const triggers = document.querySelectorAll(".open-image-modal");

  triggers.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const imgSrc = btn.getAttribute("data-img");
      if (imgSrc) {
        modalImg.src = imgSrc;
        modal.classList.add("show");
        modal.style.display = "flex";
      }
    });
  });

  function closeModal() {
    modal.classList.remove("show");
    modal.style.display = "none";
    modalImg.src = "";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (
      modal.classList.contains("show") &&
      (e.key === "Escape" || e.key === "Esc")
    ) {
      closeModal();
    }
  });
});

// Patent Image Modal functionality
window.addEventListener("DOMContentLoaded", function () {
  const patentModal = document.getElementById("patentImageModal");
  const patentModalImg = document.getElementById("patentModalImg");
  const patentCloseBtn = patentModal.querySelector(".media-modal-close");
  const patentTriggers = document.querySelectorAll(".clickable-patent");

  patentTriggers.forEach((img) => {
    img.addEventListener("click", function (e) {
      e.preventDefault();
      const imgSrc = img.getAttribute("src");
      if (imgSrc) {
        patentModalImg.src = imgSrc;
        patentModal.classList.add("show");
        patentModal.style.display = "flex";
      }
    });
  });

  function closePatentModal() {
    patentModal.classList.remove("show");
    patentModal.style.display = "none";
    patentModalImg.src = "";
  }

  patentCloseBtn.addEventListener("click", closePatentModal);
  patentModal.addEventListener("click", function (e) {
    if (e.target === patentModal) {
      closePatentModal();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (
      patentModal.classList.contains("show") &&
      (e.key === "Escape" || e.key === "Esc")
    ) {
      closePatentModal();
    }
  });
});
