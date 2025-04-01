const BASE_URL = "https://atis-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // ✅ Registrierung
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const vorname = document.getElementById("vorname").value;
      const nachname = document.getElementById("nachname").value;
      const geburtstag = document.getElementById("geburtstag").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vorname, nachname, geburtstag, email, password, role })
      });

      const data = await res.json();
      alert(data.message);
      if (data.message === "Benutzer registriert") {
        window.location.href = "login.html";
      }
    });
  }

  // ✅ Login
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
        localStorage.setItem("userName", `${data.vorname} ${data.nachname}`);
        localStorage.setItem("userVorname", data.vorname);
        localStorage.setItem("userNachname", data.nachname);
        localStorage.setItem("userGeburtstag", data.geburtstag);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }
    });
  }

  // ✅ Logout global verfügbar
  const logout = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
  window.logout = logout;
});
