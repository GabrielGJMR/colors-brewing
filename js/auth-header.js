/**
 * auth-header.js — Colors Brewing
 * Firebase v10 modular compatible
 * ================================
 * Carga como type="module" en el HTML.
 * Importa auth y funciones desde firebase.js.
 */

import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "./firebase.js";

/* ─── Detectar si estamos en /pages/ o en raíz ─── */
const isInPages = window.location.pathname.includes("/pages/");
const BASE = isInPages ? "../" : "./";
const LOGO_SRC = BASE + "icon/colors_logo.png";

/* ─── HTML del modal ─── */
function createModalHTML() {
  return `
  <div class="auth-modal-overlay" id="authModalOverlay" role="dialog" aria-modal="true">
    <div class="auth-modal">
      <button class="auth-modal-close" id="authModalClose" aria-label="Cerrar">×</button>

      <div class="auth-modal-logo">
        <img src="${LOGO_SRC}" alt="Colors Brewing" />
      </div>

      <h2>Bienvenido</h2>
      <p class="auth-subtitle">Accede a tu cuenta de Colors Brewing</p>

      <div class="auth-tabs">
        <button class="auth-tab active" id="tabLogin">Iniciar sesión</button>
        <button class="auth-tab" id="tabRegister">Registrarse</button>
      </div>

      <!-- LOGIN -->
      <form class="auth-form active" id="loginForm" novalidate>
        <div class="auth-field">
          <label>Correo electrónico</label>
          <input type="email" id="loginEmail" placeholder="tu@correo.com" autocomplete="email" />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password" />
        </div>
        <div class="auth-message" id="loginMsg"></div>
        <button type="submit" class="auth-submit">Iniciar sesión</button>
      </form>

      <!-- REGISTRO -->
      <form class="auth-form" id="registerForm" novalidate>
        <div class="auth-field">
          <label>Nombre</label>
          <input type="text" id="regName" placeholder="Tu nombre" autocomplete="name" />
        </div>
        <div class="auth-field">
          <label>Correo electrónico</label>
          <input type="email" id="regEmail" placeholder="tu@correo.com" autocomplete="email" />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input type="password" id="regPassword" placeholder="Mín. 6 caracteres" autocomplete="new-password" />
        </div>
        <div class="auth-message" id="registerMsg"></div>
        <button type="submit" class="auth-submit">Crear cuenta</button>
      </form>

      <div class="auth-divider">o continuar con</div>

      <button class="btn-google" id="btnGoogle" type="button">
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Google
      </button>
    </div>
  </div>`;
}

/* ─── HTML botón login (sin sesión) ─── */
function loginBtnHTML() {
  return `
    <button class="btn-login" id="headerLoginBtn" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      <span>Iniciar sesión</span>
    </button>`;
}

/* ─── HTML menú usuario (con sesión) ─── */
function userMenuHTML(user) {
  const displayName = user.displayName || user.email || "Usuario";
  const firstName = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();
  const photo = user.photoURL;

  return `
    <div class="user-menu-wrapper" id="userMenuWrapper">
      <button class="user-display" id="userDisplayBtn" type="button" aria-expanded="false">
        <div class="user-avatar">
          ${photo ? `<img src="${photo}" alt="${firstName}" referrerpolicy="no-referrer"/>` : initial}
        </div>
        <span>${firstName}</span>
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="user-dropdown" id="userDropdown" role="menu">
        <div class="user-dropdown-email">${user.email || displayName}</div>
        <button class="logout-btn" id="headerLogoutBtn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>`;
}

/* ─── Helpers ─── */
function showMessage(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = "auth-message " + type;
}

function clearMessages() {
  ["loginMsg", "registerMsg"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.className = "auth-message";
      el.textContent = "";
    }
  });
}

function openModal() {
  const overlay = document.getElementById("authModalOverlay");
  if (!overlay) return;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => overlay.querySelector("input")?.focus(), 220);
}

function closeModal() {
  const overlay = document.getElementById("authModalOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  clearMessages();
}

function friendlyError(code) {
  const map = {
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Credenciales incorrectas. Verifica tus datos.",
    "auth/invalid-email": "Correo electrónico inválido.",
    "auth/email-already-in-use": "Ese correo ya está registrado.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento.",
    "auth/popup-closed-by-user": "Ventana cerrada. Intenta de nuevo.",
    "auth/network-request-failed": "Error de red. Verifica tu conexión.",
  };
  return map[code] || "Ocurrió un error. Intenta de nuevo.";
}

/* ─── Inicializar modal (lazy, solo una vez) ─── */
function initModal() {
  if (document.getElementById("authModalOverlay")) return;
  document.body.insertAdjacentHTML("beforeend", createModalHTML());

  const overlay = document.getElementById("authModalOverlay");
  const tabLogin = document.getElementById("tabLogin");
  const tabReg = document.getElementById("tabRegister");
  const formLogin = document.getElementById("loginForm");
  const formReg = document.getElementById("registerForm");

  /* Cerrar */
  document
    .getElementById("authModalClose")
    .addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* Tabs */
  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabReg.classList.remove("active");
    formLogin.classList.add("active");
    formReg.classList.remove("active");
    clearMessages();
  });
  tabReg.addEventListener("click", () => {
    tabReg.classList.add("active");
    tabLogin.classList.remove("active");
    formReg.classList.add("active");
    formLogin.classList.remove("active");
    clearMessages();
  });

  /* Login email/password */
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn = formLogin.querySelector(".auth-submit");
    if (!email || !password) {
      showMessage("loginMsg", "Completa todos los campos.", "error");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Cargando...";
    clearMessages();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (err) {
      showMessage("loginMsg", friendlyError(err.code), "error");
      btn.disabled = false;
      btn.textContent = "Iniciar sesión";
    }
  });

  /* Registro */
  formReg.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const btn = formReg.querySelector(".auth-submit");
    if (!email || !password) {
      showMessage("registerMsg", "Completa correo y contraseña.", "error");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Creando cuenta...";
    clearMessages();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (name) {
        const { updateProfile } =
          await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
        await updateProfile(user, { displayName: name });
      }
      closeModal();
    } catch (err) {
      showMessage("registerMsg", friendlyError(err.code), "error");
      btn.disabled = false;
      btn.textContent = "Crear cuenta";
    }
  });

  /* Google */
  document.getElementById("btnGoogle").addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      closeModal();
    } catch (err) {
      const activeMsg = formLogin.classList.contains("active")
        ? "loginMsg"
        : "registerMsg";
      showMessage(activeMsg, friendlyError(err.code), "error");
    }
  });
}

/* ─── Render header según estado auth ─── */
function renderAuthHeader(user) {
  const slot = document.getElementById("authHeaderSlot");
  if (!slot) return;

  if (user) {
    slot.innerHTML = userMenuHTML(user);

    const btn = document.getElementById("userDisplayBtn");
    const dropdown = document.getElementById("userDropdown");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });

    document.addEventListener("click", (e) => {
      if (!slot.contains(e.target)) {
        dropdown.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    document
      .getElementById("headerLogoutBtn")
      .addEventListener("click", async () => {
        await signOut(auth);
      });
  } else {
    slot.innerHTML = loginBtnHTML();
    document.getElementById("headerLoginBtn").addEventListener("click", () => {
      initModal();
      openModal();
    });
  }
}

/* ─── Arrancar ─── */
onAuthStateChanged(auth, (user) => {
  renderAuthHeader(user);
});
