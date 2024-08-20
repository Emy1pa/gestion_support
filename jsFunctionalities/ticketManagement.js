const ticketTableBody = document.getElementById("ticketTableBody");
const createTicketBtn = document.getElementById("createTicketBtn");
const ticketModal = document.getElementById("ticketModal");
const submitTicketBtn = document.getElementById("submitTicket");
const editTicketModal = document.getElementById("editTicketModal");
const editTitleInput = document.getElementById("editTitle");
const editDescriptionInput = document.getElementById("editDescription");
const updateTicketBtn = document.getElementById("updateTicket");

let editingTicketId = null;
function addTicketToTable(ticket) {
  const isClosedTicket = ticket.status === "closed";
  const row = `
    <tr class="border-b border-gray-200 hover:bg-gray-100">
      <td class="py-3 px-6 text-left">${ticket.title}</td>
      <td class="py-3 px-6 text-left">${ticket.description}</td>
      <td class="py-3 px-6 text-center">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${
            ticket.status === "open"
              ? "bg-green-100 text-green-800"
              : ticket.status === "in_progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }">
          ${ticket.status}
        </span>
      </td>
      <td class="py-3 px-6 text-center">
        <button 
          onclick="${isClosedTicket ? "void(0)" : `editTicket(${ticket.id})`}" 
          class="text-blue-600 hover:text-blue-900 mr-2 ${
            isClosedTicket ? "opacity-50 cursor-not-allowed" : ""
          }"
          ${isClosedTicket ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button 
          onclick="${
            isClosedTicket ? "void(0)" : `deleteTicket(${ticket.id})`
          }" 
          class="text-red-600 hover:text-red-900 ${
            isClosedTicket ? "opacity-50 cursor-not-allowed" : ""
          }"
          ${isClosedTicket ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </td>
    </tr>
  `;
  ticketTableBody.insertAdjacentHTML("afterbegin", row);
}

function fetchTickets() {
  axios
    .get("http://localhost:8800/tickets")
    .then((response) => {
      const tickets = response.data;
      ticketTableBody.innerHTML = "";
      tickets.forEach((ticket) => {
        const isClosedTicket = ticket.status === "closed";
        const row = `
          <tr class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left">${ticket.title}</td>
            <td class="py-3 px-6 text-left">${ticket.description}</td>
            <td class="py-3 px-6 text-center">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  ticket.status === "open"
                    ? "bg-green-100 text-green-800"
                    : ticket.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }">
                ${ticket.status}
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              <button 
                onclick="${
                  isClosedTicket ? "void(0)" : `editTicket(${ticket.id})`
                }" 
                class="text-blue-600 hover:text-blue-900 mr-2 ${
                  isClosedTicket ? "opacity-50 cursor-not-allowed" : ""
                }"
                ${isClosedTicket ? "disabled" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                onclick="${
                  isClosedTicket ? "void(0)" : `deleteTicket(${ticket.id})`
                }" 
                class="text-red-600 hover:text-red-900 ${
                  isClosedTicket ? "opacity-50 cursor-not-allowed" : ""
                }"
                ${isClosedTicket ? "disabled" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          ${
            ticket.agent_comment
              ? `
                <tr class="border-b border-gray-200 bg-gray-50">
                  <td colspan="4" class="py-2 px-6 text-left text-sm italic">
                    Agent Comment: ${ticket.agent_comment}
                  </td>
                </tr>
              `
              : ""
          }
        `;
        ticketTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error fetching tickets:", error));
}
function editTicket(id) {
  if (id === null || id === undefined) {
    console.error("Invalid ticket ID");
    return;
  }

  axios
    .get(`http://localhost:8800/tickets/${id}`)
    .then((response) => {
      const ticket = response.data;
      if (ticket.status === "closed") {
        alert("Cannot edit a closed ticket.");
        return;
      }
      document.getElementById("editTitle").value = ticket.title;
      document.getElementById("editDescription").value = ticket.description;
      document.getElementById("editTicketModal").classList.remove("hidden");
      editingTicketId = id;
    })
    .catch((error) => console.error("Error fetching ticket data:", error));
}

function deleteTicket(id) {
  axios
    .get(`http://localhost:8800/tickets/${id}`)
    .then((response) => {
      const ticket = response.data;
      if (ticket.status === "closed") {
        alert("Cannot delete a closed ticket.");
        return;
      }
      if (confirm("Are you sure you want to delete this ticket?")) {
        axios
          .delete(`http://localhost:8800/tickets/${id}`)
          .then(() => {
            fetchTickets();
          })
          .catch((error) => console.error("Error deleting ticket:", error));
      }
    })
    .catch((error) => console.error("Error fetching ticket data:", error));
}
createTicketBtn.addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("hidden");
  ticketModal.classList.remove("hidden");
});

function closeTicketModal() {
  document.getElementById("overlay").classList.add("hidden");
  ticketModal.classList.add("hidden");
}
submitTicketBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const userId = 1; // Replace with actual user ID
  const agentId = 1; // Static agent ID as per your requirement

  axios
    .post("http://localhost:8800/tickets", {
      title: title,
      description: description,
      status: "open",
      user_id: userId,
      agent_id: agentId,
    })
    .then((response) => {
      closeTicketModal();
      // Add the new ticket to the table immediately
      addTicketToTable(response.data);
    })
    .catch((error) => console.error("Error creating ticket:", error));
});
document.getElementById("overlay").addEventListener("click", closeTicketModal);

window.onclick = function (event) {
  if (event.target == ticketModal) {
    closeTicketModal();
  }
};
function editTicket(id) {
  if (id === null || id === undefined) {
    console.error("Invalid ticket ID");
    return;
  }

  axios
    .get(`http://localhost:8800/tickets/${id}`)
    .then((response) => {
      const ticket = response.data;
      if (ticket.status === "closed") {
        alert("Cannot edit a closed ticket.");
        return;
      }
      document.getElementById("editTitle").value = ticket.title;
      document.getElementById("editDescription").value = ticket.description;
      document.getElementById("editTicketModal").classList.remove("hidden");
      editingTicketId = id;
    })
    .catch((error) => console.error("Error fetching ticket data:", error));
}
function closeEditTicketModal() {
  document.getElementById("editTicketModal").classList.add("hidden");
}

document.getElementById("updateTicket").addEventListener("click", () => {
  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDescription").value;

  axios
    .put(`http://localhost:8800/tickets/${editingTicketId}`, {
      title: title,
      description: description,
    })
    .then(() => {
      closeEditTicketModal();
      fetchTickets();
    })
    .catch((error) => console.error("Error updating ticket:", error));
});
function deleteTicket(id) {
  axios
    .get(`http://localhost:8800/tickets/${id}`)
    .then((response) => {
      const ticket = response.data;
      if (ticket.status === "closed") {
        alert("Cannot delete a closed ticket.");
        return;
      }
      if (confirm("Are you sure you want to delete this ticket?")) {
        axios
          .delete(`http://localhost:8800/tickets/${id}`)
          .then(() => {
            fetchTickets();
          })
          .catch((error) => console.error("Error deleting ticket:", error));
      }
    })
    .catch((error) => console.error("Error fetching ticket data:", error));
}
document.addEventListener("DOMContentLoaded", function () {
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent any default form submission or link action
    window.location.href = "homePage.html"; // Navigate to the home page
  });
});

fetchTickets();
