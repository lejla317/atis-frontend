const BASE_URL = "https://atis-backend.onrender.com";

// Registrierung
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      alert(data.message);
      if (data.message === "Benutzer gespeichert") {
        window.location.href = "login.html";
      }
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
        alert(data.message);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
        if (data.role === "arzt") {
          window.location.href = "arzt-dashboard.html";
        } else {
          window.location.href = "patient-dashboard.html";
        }
      } else {
        alert(data.message);
      }
    });
  }
});
