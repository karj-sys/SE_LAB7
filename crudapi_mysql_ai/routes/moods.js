import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, mood_text } = req.body; 
  try {
    // 1. Get AI Response
    const aiMessage = await getAIResponse(mood_text);

    // 2. Insert into your actual table: mood_log
    // We save the name, the mood text, and the AI's response all in one row
    await db.query(
      "INSERT INTO mood_log (full_name, mood_text, ai_message) VALUES (?, ?, ?)",
      [name || "Anonymous", mood_text, aiMessage]
    );

    // 3. Send back the response to the Vue UI
    res.json({ message: "Mood saved", ai_message: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // 4. Fetch everything from your single mood_log table
    const [rows] = await db.query("SELECT * FROM mood_log ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM mood_log WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;