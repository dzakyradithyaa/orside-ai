document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const pinWrapper = document.querySelector(".oral-disease__pin-wrapper");
  const horizontalTrack = document.querySelector(
    ".oral-disease__horizontal-track"
  );
  const cards = gsap.utils.toArray(".oral-disease__card-item");

  if (pinWrapper && horizontalTrack && cards.length > 0) {
    function setupHorizontalScroll() {
      const trackScrollWidth = horizontalTrack.scrollWidth;
      const totalScrollDistance = trackScrollWidth - window.innerWidth + 50;

      gsap.to(horizontalTrack, {
        x: -totalScrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          scrub: 1.5,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }

    setupHorizontalScroll();

    // Recalculate on resize/orientation change
    window.addEventListener("resize", () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      setupHorizontalScroll();
      ScrollTrigger.refresh();
    });
  }
});
