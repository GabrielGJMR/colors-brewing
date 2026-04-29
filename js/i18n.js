const defaultLang = "es";
let currentLang = localStorage.getItem("language") || defaultLang;

/* ============================= */
/* Resolver ruta dinámica idioma */
/* ============================= */
function getLangPath() {
  return window.location.pathname.includes("/pages/") ? "../lang/" : "lang/";
}

/* ============================= */
/* Cargar idioma */
/* ============================= */
async function loadLanguage(lang) {
  try {
    const response = await fetch(`${getLangPath()}${lang}.json`);

    if (!response.ok) {
      throw new Error(
        `No se pudo cargar ${lang}.json (HTTP ${response.status})`,
      );
    }

    const translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const path = element.getAttribute("data-i18n").split(".");
      let value = translations;

      for (const key of path) {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
          value = value[key];
        } else {
          console.warn(
            "Falta traducción para:",
            element.getAttribute("data-i18n"),
          );
          value = null;
          break;
        }
      }

      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    localStorage.setItem("language", lang);
    currentLang = lang;
    document.documentElement.lang = lang;

    const select = document.querySelector(".lang-select");
    if (select) select.value = lang;
  } catch (error) {
    console.error("Error loading language:", error);
  }
}

/* ============================= */
/* Inicializar */
/* ============================= */
function initLanguage() {
  loadLanguage(currentLang);

  const select = document.querySelector(".lang-select");
  if (select) {
    select.value = currentLang;

    select.addEventListener("change", (e) => {
      loadLanguage(e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", initLanguage);
