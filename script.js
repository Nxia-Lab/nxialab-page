const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const heroVisual = document.querySelector(".hero-visual");
if (heroVisual) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroVisual.style.transform = `translate(${x * 0.45}px, ${y * 0.45}px)`;
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpened = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpened));
    menuToggle.classList.toggle("active");
    mainNav.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    });
  });
}

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const wrapper = img.closest(".hero-image-container, .case-image");
    if (!wrapper || wrapper.querySelector(".img-fallback")) return;

    img.remove();

    const fallback = document.createElement("div");
    fallback.className = "img-fallback";
    fallback.textContent = "Vista previa no disponible";
    wrapper.appendChild(fallback);
  }, { once: true });
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    showStatus("Enviando...", "");

    setTimeout(() => {
      showStatus("Solicitud enviada con exito. Nos contactaremos pronto.", "success");
      contactForm.reset();
    }, 1500);
  });
}

function showStatus(text, type) {
  if (!formStatus) return;
  formStatus.textContent = text;
  formStatus.className = `form-status ${type}`.trim();
}
