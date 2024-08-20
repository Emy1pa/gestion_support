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

  // Update login button click handler
  loginButton.onclick = function () {
    if (loginButton.textContent === "Logout") {
      logout();
    } else {
      openModal();
    }
  };

  // Add login form submission handler
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
          updateUIForAuthenticatedUser(data.role);
          closeModal();
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
    }
  }

  function updateUIForAuthenticatedUser(role) {
    loginButton.textContent = "Logout";
    submitTicketButton.textContent = "go to tickets";
    submitTicketButton.onclick = function () {
      window.location.href = "user.html";
    };
    const currentPage = window.location.pathname.split("/").pop();

    if (role === "user") {
      if (currentPage == "user.html") {
        window.location.href = "homePage.html";
      }
    } else if (role === "agent") {
      if (currentPage == "agent.html") {
        window.location.href = "homePage.html";
      }
    } else {
      // If no role or unrecognized role, potentially log out or handle differently
      logout();
    }
  }

  function updateUIForUnauthenticatedUser() {
    loginButton.textContent = "Login to your account";
    submitTicketButton.textContent = "Submit a New Ticket";
    submitTicketButton.onclick = function () {
      openModal();
    };
  }
});
