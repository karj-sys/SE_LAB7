import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   GET Mood History
========================= */
app.get("/api/moods", async (req, res) => {
  try {
    console.log("GET /api/moods request received");

    const [rows] = await db.query(
      "SELECT id, full_name, mood_text, ai_message FROM mood_log ORDER BY id DESC"
    );

    res.json(rows);

  } catch (error) {
    console.error("Database fetch error:", error);
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

/* =========================
   POST New Mood
========================= */
app.post("/api/moods", async (req, res) => {
  try {

    console.log("POST /api/moods request received");
    console.log("Request body:", req.body);

    const { name, mood } = req.body;

    const aiMessage = "Remember to pause, breathe, and take things one step at a time.";

    const [result] = await db.query(
      "INSERT INTO mood_log (full_name, mood_text, ai_message) VALUES (?, ?, ?)",
      [name, mood, aiMessage]
    );

    console.log("Database insert result:", result);

    res.json({
      message: "Mood saved successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).json({ error: "Failed to save mood" });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});