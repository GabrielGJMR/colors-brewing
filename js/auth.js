// js/auth.js
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "./firebase.js";

const authSection = document.getElementById("authSection");
const signupWrapper = document.querySelector(".signup-wrapper");
const signupIntro = document.querySelector(".signup-intro");
const authError = document.getElementById("authError");

// ===============================
// MOSTRAR/OCULTAR SEGÚN SESIÓN
// ===============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Tiene sesión → mostrar formulario
    authSection.style.display = "none";
    if (signupWrapper) signupWrapper.style.display = "block";
    if (signupIntro) signupIntro.style.display = "block";
  } else {
    // Sin sesión → mostrar login
    authSection.style.display = "block";
    if (signupWrapper) signupWrapper.style.display = "none";
    if (signupIntro) signupIntro.style.display = "none";
  }
});

// ===============================
// LOGIN CON GOOGLE
// ===============================
document.getElementById("btnGoogle")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    authError.textContent = "Error con Google: " + err.message;
  }
});

// ===============================
// LOGIN CON CORREO
// ===============================
document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  if (!email || !pass) {
    authError.textContent = "Por favor llena todos los campos.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    authError.textContent = "Error: " + err.message;
  }
});

// ===============================
// REGISTRO CON CORREO
// ===============================
document.getElementById("btnRegister")?.addEventListener("click", async () => {
  const email = document.getElementById("registerEmail").value.trim();
  const pass = document.getElementById("registerPassword").value;

  if (!email || !pass) {
    authError.textContent = "Por favor llena todos los campos.";
    return;
  }

  if (pass.length < 6) {
    authError.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    authError.textContent = "Error: " + err.message;
  }
});

// ===============================
// TABS LOGIN / REGISTRO
// ===============================
document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".auth-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.dataset.tab;
    document.getElementById("tabLogin").classList.add("hidden");
    document.getElementById("tabRegister").classList.add("hidden");

    if (target === "login") {
      document.getElementById("tabLogin").classList.remove("hidden");
    } else {
      document.getElementById("tabRegister").classList.remove("hidden");
    }

    // Limpiar error al cambiar tab
    authError.textContent = "";
  });
});
