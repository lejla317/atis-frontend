// Registrierung & Login
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
  
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        const user = { name, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registrierung erfolgreich!");
        window.location.href = "login.html";
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
  
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && savedUser.email === email && savedUser.password === password) {
          alert("Login erfolgreich!");
          window.location.href = "dashboard.html";
        } else {
          alert("Falsche E-Mail oder Passwort.");
        }
      });
    }
  
    // Dashboard-Funktionen
    const addForm = document.getElementById("addAppointmentForm");
    const list = document.getElementById("appointmentList");
  
    if (addForm && list) {
      const saveAppointments = (appointments) => {
        localStorage.setItem("appointments", JSON.stringify(appointments));
      };
  
      const loadAppointments = () => {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        list.innerHTML = "";
        appointments.forEach((a, index) => {
          const li = document.createElement("li");
          li.textContent = `${a.name} – ${a.date} um ${a.time}`;
          const del = document.createElement("button");
          del.textContent = "❌";
          del.onclick = () => {
            appointments.splice(index, 1);
            saveAppointments(appointments);
            loadAppointments();
          };
          li.appendChild(del);
          list.appendChild(li);
        });
      };
  
      loadAppointments();
  
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("patientName").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
  
        const newAppointment = { name, date, time };
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(newAppointment);
        saveAppointments(appointments);
        loadAppointments();
        addForm.reset();
      });
    }
  });
  