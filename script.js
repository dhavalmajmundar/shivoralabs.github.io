/* Core Interactivity Script - Shivora Labs */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector(".site-header");
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Drawer Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");
  const drawerLinks = document.querySelectorAll(".mobile-drawer a");

  if (hamburger && drawer) {
    const toggleMenu = () => {
      const isOpen = drawer.classList.contains("open");
      drawer.classList.toggle("open");
      
      // Update hamburger SVG icon based on state
      if (!isOpen) {
        hamburger.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        `;
      } else {
        hamburger.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        `;
      }
    };

    hamburger.addEventListener("click", toggleMenu);

    // Close drawer when link clicked
    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (drawer.classList.contains("open")) {
          toggleMenu();
        }
      });
    });
  }

  // 3. Scroll Reveal System using IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Optionally stop observing once revealed
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px" // Triggers slightly before element enters viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. Back to Top Button
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. Copy Email Helper Function
  window.copyEmailHelper = (text, successMsg, statusElId) => {
    const statusEl = document.getElementById(statusElId);
    navigator.clipboard.writeText(text).then(() => {
      if (statusEl) {
        statusEl.textContent = successMsg;
        statusEl.classList.add("is-visible");
        setTimeout(() => {
          statusEl.classList.remove("is-visible");
        }, 4000);
      } else {
        alert(successMsg);
      }
    }).catch(() => {
      const fallbackMsg = "Could not automatically copy. Please copy manually: " + text;
      if (statusEl) {
        statusEl.textContent = fallbackMsg;
        statusEl.classList.add("is-visible");
      } else {
        alert(fallbackMsg);
      }
    });
  };
});
