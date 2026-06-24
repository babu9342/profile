const loader = document.getElementById("loader");
const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navLinkItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const typingText = document.getElementById("typingText");
const backToTop = document.getElementById("backToTop");
const counters = document.querySelectorAll("[data-counter]");
const progressBars = document.querySelectorAll(".progress i");
const revealItems = document.querySelectorAll(".reveal");
const heroShowcase = document.getElementById("heroShowcase");
const sectionBackgrounds = document.querySelectorAll(".section-bg");
const particleContainers = document.querySelectorAll(".section-particles");

const words = [
  "Full Stack Developer",
  "Java Developer",
  "Python Developer",
  "Problem Solver",
];

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;
let skillsAnimated = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
    body.classList.add("page-ready");
  }, 700);
});

function runTyping() {
  if (!typingText) return;
  const currentWord = words[wordIndex];
  typingText.textContent = currentWord.substring(0, letterIndex);

  if (!deleting && letterIndex < currentWord.length) {
    letterIndex += 1;
  } else if (deleting && letterIndex > 0) {
    letterIndex -= 1;
  } else if (!deleting && letterIndex === currentWord.length) {
    deleting = true;
    setTimeout(runTyping, 1200);
    return;
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  const speed = deleting ? 55 : 95;
  setTimeout(runTyping, speed);
}
runTyping();

function createParticles(container, count) {
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.bottom = `${Math.random() * 60}px`;
    dot.style.animationDelay = `${Math.random() * 7}s`;
    dot.style.animationDuration = `${7 + Math.random() * 5}s`;
    dot.style.opacity = String(0.35 + Math.random() * 0.45);
    container.appendChild(dot);
  }
}

particleContainers.forEach((container) => createParticles(container, 10));

window.addEventListener("mousemove", (event) => {
  if (!heroShowcase) return;
  const rect = heroShowcase.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
  const moveX = ((x / rect.width) * 2 - 1) * 8;
  const moveY = ((y / rect.height) * 2 - 1) * 8;
  heroShowcase.style.transform = `perspective(900px) rotateY(${moveX * 0.6}deg) rotateX(${moveY * -0.6}deg)`;
});

heroShowcase?.addEventListener("mouseleave", () => {
  heroShowcase.style.transform = "";
});

menuToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinkItems.forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

function activateNav() {
  let current = "";
  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 140;
    const height = section.offsetHeight;
    if (top >= offset && top < offset + height) {
      current = section.getAttribute("id");
    }
  });

  navLinkItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

function runCounters() {
  counters.forEach((counter) => {
    if (counter.dataset.done) return;
    const end = Number(counter.dataset.counter || "0");
    let value = 0;
    const step = Math.max(1, Math.ceil(end / 45));
    const tick = () => {
      value += step;
      if (value >= end) {
        counter.textContent = String(end);
        counter.dataset.done = "1";
        return;
      }
      counter.textContent = String(value);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  progressBars.forEach((bar) => {
    bar.style.width = bar.dataset.progress || "0%";
  });
}

const staggerGrids = document.querySelectorAll(
  ".stats-grid, .skills-grid, .projects-grid, .achievement-grid, .cert-grid, .timeline"
);

staggerGrids.forEach((grid) => {
  grid.querySelectorAll(".reveal").forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        if (entry.target.closest("#about")) runCounters();
        if (entry.target.closest("#skills")) animateSkillBars();
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.12 }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;
  body.style.setProperty("--scroll-progress", `${progress}%`);
}

function updateSectionParallax() {
  sectionBackgrounds.forEach((bg) => {
    const section = bg.closest(".section");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    const shift = centerOffset * 0.06;
    bg.style.transform = `translateY(${shift}px)`;
  });
}

window.addEventListener("scroll", () => {
  activateNav();
  backToTop.classList.toggle("show", window.scrollY > 500);
  updateScrollProgress();
  updateSectionParallax();
});

activateNav();
updateScrollProgress();
updateSectionParallax();

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.target.querySelector("button");
  button.textContent = "Message Sent";
  button.disabled = true;
  setTimeout(() => {
    event.target.reset();
    button.textContent = "Send Message";
    button.disabled = false;
  }, 1800);
});
