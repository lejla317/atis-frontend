const BASE_URL = "https://atis-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Registrierung
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const birthday = document.getElementById("birthday").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      // Arzt-Code nur wenn Rolle Arzt gewählt
      const arztCode = role === "arzt" ? document.getElementById("arztCode").value : "";

      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, birthday, email, password, role, arztCode })
      });

      const data = await res.json();

      if (data.message === "Benutzer registriert") {
        window.location.href = "login.html";
      } else {
        const errorBox = document.getElementById("registerError");
        if (errorBox) {
          errorBox.textContent = data.message;
          errorBox.style.display = "block";
        }
      }
    });

    // Arzt-Code-Feld nur anzeigen, wenn Arzt ausgewählt
    const roleSelect = document.getElementById("role");
    roleSelect.addEventListener("change", () => {
      const arztCodeField = document.getElementById("arztCodeField");
      arztCodeField.style.display = roleSelect.value === "arzt" ? "block" : "none";
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("firstname", data.profile.firstname);
        localStorage.setItem("lastname", data.profile.lastname);
        localStorage.setItem("birthday", data.profile.birthday);
        localStorage.setItem("email", data.profile.email);

        window.location.href = "dashboard.html";
      } else {
        const errorBox = document.getElementById("loginError");
        if (errorBox) {
          errorBox.textContent = data.message;
          errorBox.style.display = "block";
        } else {
          console.log("Fehler:", data.message);
        }
      }
    });
  }

  // Logout
  window.logout = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
});
