 const sections = document.querySelectorAll("section, .card, .member");
  const options = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        obs.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach(sec => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(30px)";
    sec.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(sec);
  });

  // Back to Top button
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });