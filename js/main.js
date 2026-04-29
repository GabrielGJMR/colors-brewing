const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");
const dropdowns = document.querySelectorAll(".dropdown");

const mobileMenu = document.getElementById("mobileMenu");
const mobileScreens = document.querySelectorAll(".mobile-screen");
const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-parent");
const backButtons = document.querySelectorAll(".back-btn");

// ===============================
// DETECCIÓN INTELIGENTE
// ===============================
const isMobile = () => window.innerWidth <= 900;
const hasHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

/* ===============================
   UTILIDADES
================================= */
function setMenuButton(open) {
  if (!menuToggle) return;

  menuToggle.textContent = open ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

function resetScreens() {
  mobileScreens.forEach((s) => s.classList.remove("active", "prev"));
  const main = document.getElementById("mainScreen");
  if (main) main.classList.add("active");
}

function openMobileMenu() {
  if (!mobileMenu) return;

  mobileMenu.classList.add("active");
  mobileMenu.setAttribute("aria-hidden", "false");
  setMenuButton(true);
  resetScreens();
  document.documentElement.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (!mobileMenu) return;

  mobileMenu.classList.remove("active");
  setMenuButton(false);
  mobileMenu.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";

  window.setTimeout(() => {
    resetScreens();
  }, 250);
}

/* ===============================
   BOTÓN HAMBURGUESA (MÓVIL)
================================= */
if (menuToggle) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isMobile()) return;

    dropdowns.forEach((d) => d.classList.remove("active"));

    // 🔥 CERRAR SELECTOR DE IDIOMA
    const langDropdown = document.querySelector(".lang-dropdown");
    if (langDropdown) {
      langDropdown.classList.remove("active");
    }

    const open = mobileMenu && mobileMenu.classList.contains("active");
    open ? closeMobileMenu() : openMobileMenu();
  });
}

/* ===============================
   DROPDOWN INTELIGENTE
================================= */
dropdowns.forEach((drop) => {
  const toggle = drop.querySelector(".dropdown-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", function (e) {
    // Tablet táctil (sin hover real)
    if (!hasHover && !isMobile()) {
      const isOpen = drop.classList.contains("active");

      // 🔥 Si ya está abierto → ahora sí navegar
      if (isOpen) {
        return; // deja que el <a> navegue normal
      }

      // 🔥 Si no está abierto → abrir dropdown
      e.preventDefault();
      e.stopPropagation();

      dropdowns.forEach((d) => d.classList.remove("active"));
      drop.classList.add("active");
    }
  });
});

/* ===============================
   CERRAR DROPDOWN SI TOCO FUERA (TABLET)
================================= */
document.addEventListener("click", (e) => {
  if (hasHover || isMobile()) return;

  dropdowns.forEach((drop) => {
    if (!drop.contains(e.target)) {
      drop.classList.remove("active");
    }
  });
});

/* ===============================
   MOBILE MENU TIPO APP
================================= */
function goToScreen(targetId, label = null) {
  const nextScreen = document.getElementById(targetId);
  if (!nextScreen) return;

  const current = document.querySelector(".mobile-screen.active");

  mobileScreens.forEach((s) => s.classList.remove("prev"));

  if (current && current !== nextScreen) {
    current.classList.add("prev");
    current.classList.remove("active");
  } else if (current) {
    current.classList.remove("active");
  }

  nextScreen.classList.add("active");

  // 🔥 ACTUALIZAR TITULO DEL SUBMENU
  const title = nextScreen.querySelector(".mobile-title");
  if (title && label) {
    title.textContent = label;
  }
}

mobileLinks.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    if (!isMobile()) return;
    if (!mobileMenu || !mobileMenu.classList.contains("active")) return;

    const target = this.dataset.target;
    if (!target) return;

    const currentScreen = document.querySelector(".mobile-screen.active");

    // 🔥 SI ESTOY EN mainScreen → abrir submenu
    if (currentScreen && currentScreen.id === "mainScreen") {
      e.preventDefault();
      goToScreen(target, this.textContent.trim());
      return;
    }

    // 🔥 SI YA ESTOY EN EL SUBMENU → dejar que el <a> navegue normal
  });
});

backButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    if (!isMobile()) return;
    if (!mobileMenu || !mobileMenu.classList.contains("active")) return;

    const backTo = this.dataset.back;
    if (!backTo) return;

    goToScreen(backTo);
  });
});

/* ===============================
   CERRAR MOBILE SI TOCO FUERA
================================= */
document.addEventListener("click", (e) => {
  if (!isMobile()) return;
  if (!mobileMenu) return;

  const open = mobileMenu.classList.contains("active");
  if (!open) return;

  if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ===============================
   RESIZE
================================= */
window.addEventListener("resize", () => {
  if (!hasHover) {
    dropdowns.forEach((d) => d.classList.remove("active"));
  }

  if (!isMobile()) {
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  }
});

/* ===============================
   INIT
================================= */
setMenuButton(false);
if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");

/* =========================================
   SIGNUP FORM VALIDATION (INSCRIBIRME)
========================================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const fields = {
    fullName: signupForm.querySelector("#fullName"),
    email: signupForm.querySelector("#email"),
    phone: signupForm.querySelector("#phone"),
    birthdate: signupForm.querySelector("#birthdate"),
    membership: signupForm.querySelector("#membership"),
    terms: signupForm.querySelector("#terms"),
  };

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  }

  function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  function setError(input) {
    input.classList.add("input-error");
  }

  function clearError(input) {
    input.classList.remove("input-error");
  }

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Reset
    Object.values(fields).forEach((field) => {
      if (field) clearError(field);
    });

    // Nombre
    if (!fields.fullName.value.trim()) {
      setError(fields.fullName);
      valid = false;
    }

    // Email
    if (!isValidEmail(fields.email.value.trim())) {
      setError(fields.email);
      valid = false;
    }

    // Teléfono
    if (!fields.phone.value.trim()) {
      setError(fields.phone);
      valid = false;
    }

    // Fecha nacimiento +18
    if (!fields.birthdate.value || calculateAge(fields.birthdate.value) < 18) {
      setError(fields.birthdate);
      valid = false;
    }

    // Membresía
    if (!fields.membership.value) {
      setError(fields.membership);
      valid = false;
    }

    // Terms
    if (!fields.terms.checked) {
      valid = false;
      alert("Debes aceptar los términos y condiciones.");
    }

    if (!valid) return;

    // ===============================
    // ENVÍO AUTOMÁTICO POR EMAILJS
    // ===============================

    const templateParams = {
      full_name: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      membership: fields.membership.value,
      message: "Sin mensaje adicional",
    };

    emailjs
      .send("service_i9mwhio", "template_apy3p6p", templateParams)
      .then(function (response) {
        console.log("Email enviado correctamente", response.status);

        // ===============================
        // RESET FORM
        // ===============================
        signupForm.reset();

        // ===============================
        // OCULTAR FORM DE MANERA LIMPIA
        // ===============================
        signupForm.classList.add("form-hidden");

        // ===============================
        // ACTIVAR SUCCESS OVERLAY
        // ===============================
        const successScreen = document.querySelector(".success-screen");
        if (successScreen) {
          successScreen.classList.add("active");
          document.body.style.overflow = "hidden";
        }

        // ===============================
        // PREPARAR MENSAJE WHATSAPP
        // ===============================
        const nombre = templateParams.full_name;
        const membresia = templateParams.membership;

        const mensajeWA =
          `Hola, Colors Brewing 👋\n\n` +
          `Adjunto mi comprobante SINPE.\n\n` +
          `Nombre: ${nombre}\n` +
          `Membresía: ${membresia}\n\n` +
          `Gracias.`;

        const waBtn = document.getElementById("waBtn");
        if (waBtn) {
          waBtn.href =
            "https://wa.me/50687331224?text=" + encodeURIComponent(mensajeWA);
        }
      })
      .catch(function (error) {
        console.error("Error enviando email:", error);

        alert("Hubo un error al enviar la inscripción. Intenta nuevamente.");
      });
  });
}

/* =========================================
   CERRAR SUCCESS OVERLAY
========================================= */

const successScreen = document.querySelector(".success-screen");
const closeSuccessBtn = document.querySelector(".back-btn-web");

if (closeSuccessBtn && successScreen) {
  closeSuccessBtn.addEventListener("click", function (e) {
    e.preventDefault();

    successScreen.classList.remove("active");
    document.body.style.overflow = "";

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.classList.remove("form-hidden");
    }
  });
}

/* =========================================
   HEADER SCROLL
========================================= */

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 50);
});

/* =========================================
   LANGUAGE DROPDOWN
========================================= */

const dropdown = document.querySelector(".lang-dropdown");
const btn = document.getElementById("langBtn");

if (btn && dropdown) {
  btn.addEventListener("click", () => {
    dropdown.classList.toggle("active");

    // 🔥 cerrar menú hamburguesa
    closeMobileMenu();
  });
}

document.querySelectorAll(".lang-menu div").forEach((item) => {
  item.addEventListener("click", () => {
    const lang = item.getAttribute("data-lang");

    console.log("Idioma seleccionado:", lang);

    // cambiar botón
    btn.innerHTML = item.innerHTML;

    // cerrar dropdown idioma
    dropdown.classList.remove("active");

    // 🔥 cerrar menú hamburguesa
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    // cambiar idioma
    setLanguage(lang);
  });
});
/* =========================================
   TRANSLATIONS
========================================= */

const TRANSLATION_PATH = window.location.pathname.includes("/pages/")
  ? "../lang"
  : "./lang";

const DEFAULT_LANG = "es";

/* =========================================
   SET LANGUAGE
========================================= */

async function setLanguage(lang) {
  try {
    console.log("Cargando:", `${TRANSLATION_PATH}/${lang}.json`);

    const res = await fetch(`${TRANSLATION_PATH}/${lang}.json`);

    if (!res.ok) throw new Error("No se encontró el JSON");

    const translations = await res.json();

    applyTranslations(translations);
    updateLanguageButton(lang); // 🔥 ACTUALIZA BOTÓN

    // guardar idioma global
    localStorage.setItem("lang", lang);
  } catch (error) {
    console.error("❌ Error cargando idioma:", error);
  }
}

/* =========================================
   APPLY TRANSLATIONS
========================================= */

function applyTranslations(translations) {
  const elements = document.querySelectorAll("[data-i18n]");

  console.log("Elementos a traducir:", elements.length);

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");

    const value = key.split(".").reduce((obj, i) => obj?.[i], translations);

    if (value) {
      el.textContent = value;
    } else {
      console.warn("⚠️ Falta traducción para:", key);
    }
  });
}

/* =========================================
   UPDATE BUTTON (🔥 SOLUCIÓN FINAL)
========================================= */

function updateLanguageButton(lang) {
  const btn = document.getElementById("langBtn");
  if (!btn) return;

  const isPages = window.location.pathname.includes("/pages/");
  const basePath = isPages ? "../icon/" : "icon/";

  if (lang === "es") {
    btn.innerHTML = `<img src="${basePath}bandera-es.png" alt="" /> ES`;
  } else {
    btn.innerHTML = `<img src="${basePath}bandera-en.png" alt="" /> EN`;
  }
}

/* =========================================
   LOAD LANGUAGE ON START
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || DEFAULT_LANG;

  console.log("Idioma inicial:", savedLang);

  setLanguage(savedLang);
});

document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".lang-dropdown");

  if (!dropdown) return;

  // si haces click fuera del dropdown
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});
