const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(".site-nav a").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

document.querySelectorAll(".current-year").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(
  ".hero-grid > div, .hero-visual, .page-hero .container, .section-heading, .metric, .motion-card, .project-card, .card, .case-study, .experience-item, .skill-block, .resume-panel, .contact-method"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js-motion");

  revealItems.forEach((item, index) => {
    item.dataset.reveal = "";
    item.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[data-counter]");

const setCounterValue = (node, value) => {
  const suffix = node.dataset.suffix || "";
  node.textContent = `${Math.round(value).toLocaleString()}${suffix}`;
};

const animateCounter = (node) => {
  const target = Number(node.dataset.target);

  if (!Number.isFinite(target) || prefersReducedMotion) {
    setCounterValue(node, target);
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    setCounterValue(node, target * eased);

    if (elapsed < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  counters.forEach(animateCounter);
} else {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
