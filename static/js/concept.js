document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lensSection = document.getElementById("lens-section");
  if (!lensSection) return;

  const lens = document.querySelector(".lens-scanner");
  const mainTitle = document.querySelector(".lens-title");
  const panelProblem = document.getElementById("panel-problem");
  const panelConcept = document.getElementById("panel-concept");

  gsap.set([panelProblem, panelConcept], { autoAlpha: 0, y: 40 });
  gsap.set(lens, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });

  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: lensSection,
          pin: "#lens-pin",
          scrub: 2,
          start: "top top",
          end: "bottom bottom",
          pinSpacing: false,
        },
      });

      gsap.set(lens, { xPercent: -50, yPercent: 100, scale: 1 });

      tl.to(mainTitle, { autoAlpha: 0, duration: 1 }, "start")
        .to(
          lens,
          {
            xPercent: -300,
            yPercent: -180,
            scale: 0.7,
            ease: "power2.inOut",
            duration: 2,
          },
          "<"
        )
        .to(
          panelProblem,
          { autoAlpha: 1, y: 40, x: -300, duration: 1.5 },
          "-=1"
        )
        .to(panelProblem, { autoAlpha: 0, y: 0, duration: 1.5 }, "+=3")
        .to(
          lens,
          {
            xPercent: 200,
            yPercent: -180,
            scale: 0.7,
            opacity: 1,
            duration: 2,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          panelConcept,
          { autoAlpha: 1, y: 40, x: 300, duration: 1.5 },
          "-=1"
        );
    },

    "(min-width: 768px) and (max-width: 1024px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: lensSection,
          pin: "#lens-pin",
          scrub: 2,
          start: "top top",
          end: "bottom bottom",
        },
      });

      gsap.set(lens, { xPercent: -50, yPercent: 90, scale: 1 });

      tl.to(mainTitle, { autoAlpha: 0, duration: 1 }, "start")
        .to(
          lens,
          {
            xPercent: -50,
            yPercent: -190,
            scale: 0.7,
            duration: 2,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(panelProblem, { autoAlpha: 1, y: 30, duration: 1.5 }, "-=1")
        .to(panelProblem, { autoAlpha: 0, y: -30, duration: 1.5 }, "+=3")
        .to(
          lens,
          { xPercent: -50, yPercent: -190, scale: 0.7, duration: 2 },
          "<"
        )
        .to(panelConcept, { autoAlpha: 1, y: 30, duration: 1.5 }, "-=1");
    },

    "(max-width: 767px)": () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: lensSection,
          pin: "#lens-pin",
          scrub: 2,
          start: "top top",
          end: "bottom bottom",
        },
      });

      gsap.set(lens, { xPercent: -50, yPercent: 90, scale: 0.8 });

      tl.to(mainTitle, { autoAlpha: 0, duration: 0.8 }, "start")
        .to(
          lens,
          {
            xPercent: -50,
            yPercent: -200,
            scale: 0.7,
            duration: 1.5,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          panelProblem,
          { autoAlpha: 1, y: 50, duration: 1.2, scale: 0.8 },
          "-=0.8"
        )
        .to(panelProblem, { autoAlpha: 0, y: -20, duration: 1.2 }, "+=2.5")
        .to(
          lens,
          { xPercent: -50, yPercent: -200, scale: 0.7, duration: 1.5 },
          "<"
        )
        .to(
          panelConcept,
          { autoAlpha: 1, y: 50, scale: 0.8, duration: 1.2 },
          "-=1"
        );
    },
  });
});
