import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";
import { db } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/moods", moodRoutes);

// --- PART 0.2: ADD LOGGING IN THE API ---
// This route matches your lab requirements specifically
app.post("/mood", async (req, res) => {
  console.log("POST /mood request received");
  console.log("Request body:", req.body);

  const mood = req.body.mood;
  
  try {
    // NOTE: Make sure your table is 'mood_log' for this specific route 
    // or change to 'moods' if that's what you used in Lab 5.
    const result = await db.query(
      "INSERT INTO mood_log (mood) VALUES (?)",
      [mood]
    );

    console.log("Database insert result:", result);
    res.json({ message: "Mood saved successfully" });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- PART 4: SYSTEM HEALTH CHECK ---
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});