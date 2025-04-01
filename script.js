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

      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, birthday, email, password, role })
      });

      const data = await res.json();
      alert(data.message);
      if (data.message === "Benutzer registriert") {
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
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name); // Vorname
        localStorage.setItem("userFirstname", data.profile.firstname);
        localStorage.setItem("userLastname", data.profile.lastname);
        localStorage.setItem("userBirthday", data.profile.birthday);
        localStorage.setItem("userEmail", data.profile.email);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }
    });
  }

  // Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
  window.logout = logout;

  // Profil anzeigen
  const showProfile = () => {
    const vorname = localStorage.getItem("userFirstname");
    const nachname = localStorage.getItem("userLastname");
    const email = localStorage.getItem("userEmail");
    const geburtstag = localStorage.getItem("userBirthday");

    alert(
      `👤 Dein Profil:\n\nVorname: ${vorname}\nNachname: ${nachname}\nGeburtstag: ${geburtstag}\nE-Mail: ${email}`
    );
  };
  window.showProfile = showProfile;
});
