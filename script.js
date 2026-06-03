// --- MOTOR DE SCROLL SUAVE (LENIS) ---
let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Vincular navegación con Lenis.scrollTo para transiciones elásticas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        // Quitar clases activas del menú móvil si está abierto
        const menuToggle = document.querySelector(".menu-toggle");
        const mainNav = document.querySelector(".main-nav");
        if (menuToggle && mainNav && menuToggle.classList.contains("active")) {
          menuToggle.classList.remove("active");
          mainNav.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("no-scroll");
        }

        lenis.scrollTo(targetEl, { offset: -30, duration: 1.2 });
      }
    });
  });
}

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
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (submitButton) submitButton.disabled = true;
    showStatus("Enviando...", "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo enviar el mensaje.");
      }

      showStatus("Mensaje enviado con exito. Te responderemos pronto.", "success");
      contactForm.reset();
    } catch (error) {
      showStatus(error.message || "No se pudo enviar el mensaje.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function showStatus(text, type) {
  if (!formStatus) return;
  formStatus.textContent = text;
  formStatus.className = `form-status ${type}`.trim();
}

// --- NUEVA INTERACTIVIDAD PREMIUM ---

// Acordeón de FAQs
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isExpanded = btn.getAttribute("aria-expanded") === "true";
    const answer = btn.nextElementSibling;

    // Cerrar otros acordeones abiertos
    document.querySelectorAll(".faq-question").forEach((otherBtn) => {
      if (otherBtn !== btn) {
        otherBtn.setAttribute("aria-expanded", "false");
        otherBtn.nextElementSibling.style.maxHeight = null;
      }
    });

    // Alternar el actual
    btn.setAttribute("aria-expanded", String(!isExpanded));
    if (!isExpanded) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});

// Scroll Reveal
const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach((el) => revealObserver.observe(el));
}

// Simulador de IA y Automatización
const simulatorData = {
  emails: [
    { icon: "mail", title: "Origen (Trigger)", desc: "Llega un nuevo correo de contacto a info@empresa.com." },
    { icon: "robot", title: "Procesamiento (IA)", desc: "GPT analiza la consulta, categoriza la prioridad y genera un borrador inteligente." },
    { icon: "database", title: "Acción (Destino)", desc: "Se crea una fila de seguimiento en Notion y se notifica al equipo por Slack." }
  ],
  pdf: [
    { icon: "file", title: "Origen (Trigger)", desc: "Se sube un presupuesto o factura en PDF a una carpeta de Google Drive." },
    { icon: "robot", title: "Procesamiento (IA)", desc: "OpenAI lee el documento y extrae importes, fechas y datos clave del emisor." },
    { icon: "table", title: "Acción (Destino)", desc: "Se insertan los datos en Google Sheets y se envía al software administrativo." }
  ],
  reportes: [
    { icon: "clock", title: "Origen (Trigger)", desc: "Llega el primer día del mes. Se activa el disparador cron programado." },
    { icon: "robot", title: "Procesamiento (IA)", desc: "Un script recopila ventas de la base de datos y redacta conclusiones con IA." },
    { icon: "envelope", title: "Acción (Destino)", desc: "Se genera un PDF de rendimiento y se envía automáticamente a los socios por correo." }
  ]
};

function getIconSvg(name) {
  const icons = {
    mail: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    robot: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
    database: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
    file: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`,
    table: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
    envelope: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    lightning: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    message: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  };
  return icons[name] || icons.lightning;
}

function parseCustomInput(text) {
  let triggerIcon = "lightning";
  let triggerTitle = "Origen (Trigger)";
  let triggerDesc = "Se detecta un evento inicial en tus herramientas o archivos.";

  let actionIcon = "gear";
  let actionTitle = "Acción (Destino)";
  let actionDesc = "Se ejecuta de manera automatizada la tarea final esperada.";

  const lower = text.toLowerCase().trim();

  // Trigger parsing
  if (lower.includes("whatsapp")) {
    triggerIcon = "message";
    triggerTitle = "Mensaje Recibido";
    triggerDesc = "Llega un mensaje a tu cuenta de WhatsApp Business.";
  } else if (lower.includes("email") || lower.includes("correo") || lower.includes("gmail") || lower.includes("mail")) {
    triggerIcon = "mail";
    triggerTitle = "Nuevo Correo";
    triggerDesc = "Se recibe un nuevo correo con adjuntos o consultas.";
  } else if (lower.includes("pdf") || lower.includes("factura") || lower.includes("archivo") || lower.includes("drive")) {
    triggerIcon = "file";
    triggerTitle = "Archivo Subido";
    triggerDesc = "Se detecta un nuevo archivo subido en Google Drive o Dropbox.";
  } else if (lower.includes("formulario") || lower.includes("registro") || lower.includes("web") || lower.includes("lead")) {
    triggerIcon = "globe";
    triggerTitle = "Formulario Web";
    triggerDesc = "Un visitante del sitio web llena el formulario de contacto.";
  } else if (lower.includes("sheet") || lower.includes("excel") || lower.includes("tabla")) {
    triggerIcon = "table";
    triggerTitle = "Nueva Fila";
    triggerDesc = "Se inserta una nueva fila en una planilla de Google Sheets.";
  }

  // Action parsing
  if (lower.includes("sheet") || lower.includes("excel") || lower.includes("tabla") || lower.includes("guardar")) {
    actionIcon = "table";
    actionTitle = "Planilla Actualizada";
    actionDesc = "Se cargan los datos ya estructurados en tu Google Sheets.";
  } else if (lower.includes("notion") || lower.includes("crm") || lower.includes("trello")) {
    actionIcon = "database";
    actionTitle = "CRM Actualizado";
    actionDesc = "Se crea o actualiza la ficha del cliente en Notion/CRM.";
  } else if (lower.includes("slack") || lower.includes("discord") || lower.includes("aviso") || lower.includes("notificar")) {
    actionIcon = "bell";
    actionTitle = "Notificación Enviada";
    actionDesc = "El equipo recibe una alerta instantánea por Slack o Discord.";
  } else if (lower.includes("whatsapp") || lower.includes("enviar whatsapp")) {
    actionIcon = "message";
    actionTitle = "WhatsApp Enviado";
    actionDesc = "Se envía una respuesta automatizada personalizada al cliente.";
  } else if (lower.includes("email") || lower.includes("correo") || lower.includes("enviar")) {
    actionIcon = "mail";
    actionTitle = "Email Enviado";
    actionDesc = "Se dispara un correo formal de confirmación o aviso automático.";
  }

  return [
    { icon: triggerIcon, title: triggerTitle, desc: triggerDesc },
    { icon: "robot", title: "Procesamiento (IA)", desc: "La IA interpreta el contenido, extrae entidades y define la acción óptima." },
    { icon: actionIcon, title: actionTitle, desc: actionDesc }
  ];
}

function renderFlow(steps) {
  const container = document.getElementById("simulator-flow-container");
  if (!container) return;

  container.innerHTML = "";

  steps.forEach((step, index) => {
    // Crear paso
    const stepEl = document.createElement("div");
    stepEl.className = `flow-step${index === 1 ? " step-ai" : ""}`;
    stepEl.innerHTML = `
      <div class="step-icon">${getIconSvg(step.icon)}</div>
      <div class="step-content">
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>
    `;
    container.appendChild(stepEl);

    // Crear línea de conexión
    if (index < steps.length - 1) {
      const lineEl = document.createElement("div");
      lineEl.className = "flow-line";
      lineEl.innerHTML = '<div class="flow-dot"></div>';
      container.appendChild(lineEl);
    }
  });

  // Animación secuencial de entrada
  const flowSteps = container.querySelectorAll(".flow-step");
  flowSteps.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("active");
    }, index * 300);
  });
}

// Inicializar y vincular eventos del simulador y pastilla deslizante
const presetButtons = document.querySelectorAll(".preset-btn");
const runButton = document.getElementById("simulator-run-btn");
const customInput = document.getElementById("simulator-custom-input");

function updateSlidingPill() {
  const activeBtn = document.querySelector(".preset-btn.active");
  const pill = document.getElementById("sliding-pill");
  if (activeBtn && pill) {
    pill.style.width = `${activeBtn.offsetWidth}px`;
    pill.style.left = `${activeBtn.offsetLeft}px`;
  }
}

if (presetButtons.length > 0) {
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateSlidingPill();
      if (customInput) customInput.value = ""; // Limpiar campo libre al usar preajuste

      const presetKey = btn.getAttribute("data-preset");
      if (simulatorData[presetKey]) {
        renderFlow(simulatorData[presetKey]);
      }
    });
  });

  // Renderizar por defecto el primer caso e iniciar pastilla
  renderFlow(simulatorData.emails);
  setTimeout(updateSlidingPill, 100);
  window.addEventListener("resize", updateSlidingPill);
}

if (runButton && customInput) {
  const processCustomInput = () => {
    const text = customInput.value.trim();
    if (!text) return;

    // Quitar selección activa de los botones preajustados
    presetButtons.forEach((b) => b.classList.remove("active"));

    const generatedSteps = parseCustomInput(text);
    renderFlow(generatedSteps);
  };

  runButton.addEventListener("click", processCustomInput);

  customInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      processCustomInput();
    }
  });
}

// --- EFECTO SPOTLIGHT PARA TARJETAS DE ALTO VALOR ($10K) ---
document.querySelectorAll(".spotlight-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});
