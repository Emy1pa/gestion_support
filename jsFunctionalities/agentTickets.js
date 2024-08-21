const ticketTableBody = document.getElementById("ticketTableBody");
const updateTicketModal = document.getElementById("updateTicketModal");
const statusUpdateSelect = document.getElementById("statusUpdate");
const commentInput = document.getElementById("commentInput");
const updateTicketBtn = document.getElementById("updateTicketBtn");

let currentTicketId = null;
const agentId = 1; // Replace with actual agent ID (you might want to get this from login)

function fetchAgentTickets() {
  axios
    .get(`http://localhost:8800/agent-tickets/${agentId}`)
    .then((response) => {
      const tickets = response.data;
      ticketTableBody.innerHTML = "";
      tickets.forEach((ticket) => {
        const row = `
          <tr class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left">${ticket.title}</td>
            <td class="py-3 px-6 text-left">${ticket.description}</td>
            <td class="py-3 px-6 text-center">${ticket.status}</td>
            <td class="py-3 px-6 text-center">
              <button onclick="openUpdateModal(${ticket.id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                Update
              </button>
            </td>
          </tr>
        `;
        ticketTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error fetching agent tickets:", error));
}

function openUpdateModal(ticketId) {
  currentTicketId = ticketId;
  updateTicketModal.classList.remove("hidden");
}

function closeUpdateModal() {
  updateTicketModal.classList.add("hidden");
  statusUpdateSelect.value = "open";
  commentInput.value = "";
}

updateTicketBtn.addEventListener("click", () => {
  const status = statusUpdateSelect.value;
  const comment = commentInput.value;

  axios
    .put(`http://localhost:8800/agent-update-ticket/${currentTicketId}`, {
      status: status,
      comment: comment,
      agentId: agentId,
    })
    .then(() => {
      closeUpdateModal();
      fetchAgentTickets();
    })
    .catch((error) => console.error("Error updating ticket:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "homePage.html";
  });
});
fetchAgentTickets();
