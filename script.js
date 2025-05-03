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
      isDragging = true;
    });

    testimonialsTrack.addEventListener(
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

    testimonialsTrack.addEventListener("touchend", (e) => {
      if (!isDragging) return;

      const currentX = e.changedTouches[0].clientX;
      const diff = currentX - startX;

      // Determine if we should move to the next or previous slide
      const threshold = 50; // minimum distance to trigger slide change

      if (diff < -threshold) {
        // Swipe left - next slide
        currentIndex += 1;
      } else if (diff > threshold) {
        // Swipe right - previous slide
        currentIndex -= 1;
      }

      updateSliderPosition();
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
});
