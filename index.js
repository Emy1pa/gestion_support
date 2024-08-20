import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestionsupport",
});

app.get("/", (req, res) => {
  res.json("hello this is the backend");
});
// app.get("/users", (req, res) => {
//   const q = "SELECT * FROM users";
//   db.query(q, (err, data) => {
//     if (err) return res.json(err);
//     else res.json(data);
//   });
// });
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err) => {
      if (err) {
        return res.status(500).json({ error: "Password comparison error" });
      }

      if (password != user.password) {
        return res.status(401).json({ error: "Invalid password" });
      }

      res.json({ role: user.role });
    });
  });
});

// Get all tickets
app.get("/tickets", (req, res) => {
  const q = `
    SELECT t.*, c.comment as agent_comment 
    FROM tickets t 
    LEFT JOIN comments c ON t.id = c.ticket_id 
    WHERE c.id = (
      SELECT MAX(id) 
      FROM comments 
      WHERE ticket_id = t.id
    )
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});
// Create a new ticket
app.post("/tickets", (req, res) => {
  const q =
    "INSERT INTO tickets (title, description, status, user_id, agent_id) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.status || "open", // Default status if not provided
    req.body.user_id,
    req.body.agent_id || null, // Agent might not be assigned immediately
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(201)
      .json({ message: "Ticket created successfully", id: data.insertId });
  });
});
// Get a single ticket by ID
app.get("/tickets/:id", (req, res) => {
  const ticketId = req.params.id;
  const q = "SELECT * FROM tickets WHERE id = ?";

  db.query(q, [ticketId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "Ticket not found" });
    return res.json(data[0]);
  });
});
// Update a ticket
app.put("/tickets/:id", (req, res) => {
  const ticketId = req.params.id;
  const q = "UPDATE tickets SET title = ?, description = ? WHERE id = ?";
  const values = [req.body.title, req.body.description, ticketId];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json({ message: "Ticket not found" });
    return res.json({ message: "Ticket updated successfully" });
  });
});

// Delete a ticket
app.delete("/tickets/:id", (req, res) => {
  const ticketId = req.params.id;
  const q = "DELETE FROM tickets WHERE id = ?";

  db.query(q, [ticketId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res.status(404).json({ message: "Ticket not found" });
    return res.json({ message: "Ticket deleted successfully" });
  });
});

// get tickets that were assigned to the agent
app.get("/agent-tickets/:agentId", (req, res) => {
  const agentId = req.params.agentId;
  const q = "SELECT * FROM tickets WHERE agent_id = ?";
  db.query(q, [agentId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// Update the statut and add a comment
app.put("/agent-update-ticket/:id", (req, res) => {
  const ticketId = req.params.id;
  const { status, comment, agentId } = req.body;

  const updateTicketQ = "UPDATE tickets SET status = ? WHERE id = ?";
  const addCommentQ =
    "INSERT INTO comments (ticket_id, user_id, comment) VALUES (?, ?, ?)";

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    db.query(updateTicketQ, [status, ticketId], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json(err);
        });
      }

      db.query(addCommentQ, [ticketId, agentId, comment], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json(err);
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }
          res.json({
            message: "Ticket updated and comment added successfully",
          });
        });
      });
    });
  });
});

// Get comments for a ticket
app.get("/ticket-comments/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const q =
    "SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at DESC";

  db.query(q, [ticketId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});
app.listen(8800, () => {
  console.log("connected to backend");
});
