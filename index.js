const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable JSON and CORS requests.
app.use(express.json());
app.use(cors());

// In-memory leaderboard storage (as a simple array for demo purposes)
// Each entry: { name: "PlayerName", score: Number }
let leaderboard = [];

// GET endpoint to retrieve the leaderboard
app.get("/leaderboard", (req, res) => {
  // For simplicity, sort by highest score and return top 10.
  const sorted = leaderboard.sort((a, b) => b.score - a.score);
  res.json(sorted.slice(0, 10));
});

// POST endpoint to submit a score
app.post("/submitScore", (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
      return res.status(400).json({ error: "Invalid payload." });
    }
    // Look for an existing entry for this username
    const existingIndex = leaderboard.findIndex(entry => entry.name === name);
    if (existingIndex !== -1) {
      // If the new score is lower than or equal to the current score, throw an error.
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
        return res.status(201).json({ success: true });
      } else {
        return res.status(400).json({ error: "Submitted score is lower than or equal to current score." });
      }
    } else {
      leaderboard.push({ name, score });
      return res.status(201).json({ success: true });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Leaderboard API is running on port ${PORT}`);
});
