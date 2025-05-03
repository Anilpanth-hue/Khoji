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
});
