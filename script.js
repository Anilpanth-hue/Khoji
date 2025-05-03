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

  // Testimonial Slider
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
      return window.innerWidth >= 768 ? 2 : 1;
    }

    // Update slider position
    function updateSliderPosition() {
      const slidesPerView = getSlidesPerView();
      const maxIndex = slideCount - slidesPerView;

      // Prevent sliding past the last slide
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      // Calculate percentage to translate
      const translatePercentage = -(currentIndex * (100 / slidesPerView));
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
      const slidesPerView = getSlidesPerView();

      if (diff < -threshold && currentIndex < slideCount - slidesPerView) {
        // Swipe left - next slide
        currentIndex++;
      } else if (diff > threshold && currentIndex > 0) {
        // Swipe right - previous slide
        currentIndex--;
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
      const slidesPerView = getSlidesPerView();

      if (diff < -threshold && currentIndex < slideCount - slidesPerView) {
        // Swipe left - next slide
        currentIndex++;
      } else if (diff > threshold && currentIndex > 0) {
        // Swipe right - previous slide
        currentIndex--;
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

    // Handle window resize
    window.addEventListener("resize", () => {
      updateSliderPosition();
    });

    // Initial position
    updateSliderPosition();
  }
});
