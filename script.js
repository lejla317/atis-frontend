const BASE_URL = "https://atis-backend.onrender.com";

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
      if (data.message === "Benutzer registriert") {
        window.location.href = "login.html";
      }
    });
  }

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
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }
    });
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
  window.logout = logout;

  const patient = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");

  // Patient Dashboard
  const terminListe = document.getElementById("terminListe");
  const meineTermine = document.getElementById("meineTermine");
  if (terminListe && meineTermine) {
    fetch(`${BASE_URL}/api/termine`)
      .then(res => res.json())
      .then(termine => {
        terminListe.innerHTML = "";
        meineTermine.innerHTML = "";
        termine.forEach(t => {
          if (t.status === "frei") {
            const li = document.createElement("li");
            li.textContent = `${t.date} um ${t.time} bei ${t.arzt}`;
            const btn = document.createElement("button");
            btn.textContent = "Buchen";
            btn.onclick = async () => {
              const res = await fetch(`${BASE_URL}/api/termine/buchen`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: t._id, patient })
              });
              const data = await res.json();
              alert(data.message);
              window.location.reload();
            };
            li.appendChild(btn);
            terminListe.appendChild(li);
          } else if (t.patient === patient) {
            const li = document.createElement("li");
            li.textContent = `${t.date} um ${t.time} bei ${t.arzt}`;
            meineTermine.appendChild(li);
          }
        });
      });
  }

  // Arzt Dashboard
  const addForm = document.getElementById("freigabeForm");
  const alleTermine = document.getElementById("alleTermine");
  const kalender = document.getElementById("kalender");

  if (addForm && alleTermine && kalender) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const arzt = localStorage.getItem("userName");

      const res = await fetch(`${BASE_URL}/api/termine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, arzt })
      });

      const data = await res.json();
      alert(data.message);
      window.location.reload();
    });

    fetch(`${BASE_URL}/api/termine`)
      .then(res => res.json())
      .then(termine => {
        alleTermine.innerHTML = "";
        kalender.innerHTML = "<tr><th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th><th>Sa</th><th>So</th></tr>";
        const arzt = localStorage.getItem("userName");

        let tag = new Date("2025-04-01");
        let zeile = document.createElement("tr");
        while (tag.getDay() !== 1) {
          zeile.appendChild(document.createElement("td"));
          tag.setDate(tag.getDate() - 1);
        }

        tag = new Date("2025-04-01");
        for (let d = 1; d <= 30; d++) {
          const datumStr = `2025-04-${d.toString().padStart(2, "0")}`;
          const zelle = document.createElement("td");
          zelle.innerHTML = `<strong>${d}</strong><br>`;

          const tagesTermine = termine.filter(t => t.date === datumStr && t.arzt === arzt);
          tagesTermine.forEach(t => {
            const info = document.createElement("div");
            info.textContent = `${t.time} ${t.status === "frei" ? "🟢" : "❌"}`;
            info.className = t.status === "frei" ? "frei" : "gebucht";
            zelle.appendChild(info);
          });

          zeile.appendChild(zelle);
          if (tag.getDay() === 0 || d === 30) {
            kalender.appendChild(zeile);
            zeile = document.createElement("tr");
          }

          tag.setDate(tag.getDate() + 1);
        }

        termine.forEach(t => {
          if (t.status === "gebucht" && t.arzt === arzt) {
            const li = document.createElement("li");
            li.textContent = `${t.date} um ${t.time} – Patient: ${t.patient}`;
            alleTermine.appendChild(li);
          }
        });
      });
  }
});
