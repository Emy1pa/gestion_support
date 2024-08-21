document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.getElementById("modalOverlay");
  const loginModal = document.getElementById("loginModal");
  const loginButton = document.getElementById("loginButton");
  const submitTicketButton = document.getElementById("submitTicketButton");

  // Check if user is already logged in
  checkAuthState();

  window.openModal = function () {
    modalOverlay.classList.remove("hidden");
    loginModal.classList.remove("hidden");
  };

  window.closeModal = function () {
    modalOverlay.classList.add("hidden");
    loginModal.classList.add("hidden");
  };

  window.onclick = function (event) {
    if (event.target == modalOverlay) {
      closeModal();
    }
  };

  // Update login button
  loginButton.onclick = function () {
    if (loginButton.textContent === "Logout") {
      logout();
    } else {
      openModal();
    }
  };

  // Add login form submission
  const loginForm = loginModal.querySelector("form");
  if (loginForm) {
    loginForm.onsubmit = function (e) {
      e.preventDefault();
      const email = document.getElementById("emailInput").value.trim();
      const password = document.getElementById("passwordInput").value.trim();
      login(email, password);
    };
  }

  function login(email, password) {
    fetch("http://localhost:8800/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem("userRole", data.role);
          if (data.role === "user") {
            window.location.href = "user.html";
          } else if (data.role === "agent") {
            window.location.href = "agent.html";
          } else {
            // If no role or unrecognized role, potentially log out or handle differently
            logout();
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
      });
  }

  function logout() {
    localStorage.removeItem("userRole");
    updateUIForUnauthenticatedUser();
  }

  function checkAuthState() {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      updateUIForAuthenticatedUser(userRole);
    } else {
      updateUIForUnauthenticatedUser();
    }
  }

  function updateUIForAuthenticatedUser(role) {
    loginButton.textContent = "Logout";

    if (role === "user") {
      submitTicketButton.textContent = "Go to Tickets";
      submitTicketButton.onclick = function () {
        window.location.href = "user.html";
      };
    } else if (role === "agent") {
      submitTicketButton.textContent = "Go to Dashboard";
      submitTicketButton.onclick = function () {
        window.location.href = "agent.html";
      };
    } else {
      logout();
    }
  }
  function updateUIForUnauthenticatedUser() {
    loginButton.textContent = "Login to your account";
    submitTicketButton.classList.add("hidden");
  }
});
