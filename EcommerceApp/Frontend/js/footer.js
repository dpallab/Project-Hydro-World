createFooter();

function createFooter() {
  const footer = document.querySelector(".footer-panel");

  if (!footer) return; // Prevent errors if .footer-panel doesn't exist

  footer.innerHTML = `<div class="footer-panel">
  <div class="footer-content">
    <div class="footer-column footer-brand">
      The agency for <br> impatient brands®
    </div>

    <div class="footer-column">
      <h4>London</h4>
      <a href="mailto:newbusiness@weareimpero.com">newbusiness@weareimpero.com</a><br>
      +44 20 7998 7571 <br>
      Unit 306, Metropolitan Wharf,<br>
      70 Wapping Wall, London E1W 3SS <br>
      <a href="#">See on map →</a>
    </div>

    <div class="footer-column">
      <h4>Buenos Aires</h4>
      <a href="mailto:buenosaires@weareimpero.com">buenosaires@weareimpero.com</a><br>
      +54 11 6799 7949 <br>
      Cabildo 1458 1st floor,<br>
      Buenos Aires <br>
      <a href="#">See on map →</a>
    </div>

    <div class="footer-column newsletter">
      <p>Want to be the smartest in your office?</p>
      <a href="#">Sign up for our newsletter →</a>
      <p>Follow us</p>
    <div class="social-icons">
    <a href="#" aria-label="Behance"><i class="fab fa-behance"></i></a>
     <a href="#" aria-label="Dribbble"><i class="fab fa-dribbble"></i></a>
    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
</div>

    </div>
  </div>

  <div class="footer-bottom">
    &copy; <span id="year"></span> Handcrafted Treasures. All rights reserved.
  </div>
</div>
`;
  // Load Font Awesome dynamically
  function loadFontAwesome() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(link);
  }

  // Example: call it before creating your footer
  loadFontAwesome();

  // Set the current year
  document.getElementById("year").textContent = new Date().getFullYear();
}
