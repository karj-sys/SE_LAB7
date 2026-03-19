<template>
  <div class="container">
    <h2>Mood Check-in</h2>

    <div class="form-group">
      <input v-model="name" placeholder="Your name" :disabled="loading" />
      <textarea v-model="mood" placeholder="How are you feeling today?" :disabled="loading"></textarea>

      <button @click="submitMood" :disabled="loading || !name || !mood">
        <span v-if="loading">💬 Processing...</span>
        <span v-else>Submit</span>
      </button>
    </div>

    <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
    <div v-if="aiMessage" class="ai-box">
      <strong>AI Advisor:</strong> {{ aiMessage }}
    </div>

    <hr />

    <h3>Mood History</h3>
    <button @click="fetchHistory" class="refresh-btn">🔄 Refresh History</button>

    <table v-if="history.length > 0" class="history-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Mood</th>
          <th>AI Response</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in history" :key="entry.id">
          <td>{{ entry.full_name }}</td>
          <td>{{ entry.mood_text }}</td>
          <td>{{ entry.ai_message }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No history found.</p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      name: '',
      mood: '',
      aiMessage: '',
      loading: false,
      error: null,
      history: []
    };
  },
  mounted() {
    this.fetchHistory(); 
  },
  methods: {
    async submitMood() {
      // --- PART 0.1: LOGGING ---
      console.log("User clicked submit button");
      console.log("Mood value entered:", this.mood);

      // --- PART 1: BUG #1 (Undefined Variable) ---
      // UNCOMMENT the line below to trigger the ReferenceError for your screenshot, then comment it back.
      // console.log("User mood value:", moodValue); 

      this.loading = true;
      this.error = null;
      
      try {
        const res = await api.post('/api/moods', {
          user_id: 1, // Static ID for lab purposes
          mood_text: this.mood
        });
        
        // --- PART 0.1: LOGGING STATUS ---
        console.log("API response status:", res.status);
        
        this.aiMessage = res.data.ai_message || res.data.aiMessage;
        this.mood = ''; 
        this.fetchHistory();
      } catch (err) {
        console.error("Submit error:", err);
        this.error = "Failed to connect to server. Is the backend running?";
      } finally {
        this.loading = false;
      }
    },
    async fetchHistory() {
      try {
        const res = await api.get('/api/moods');
        // PART 2: Inspect this in the Network Tab for your screenshot!
        this.history = res.data;
      } catch (err) {
        console.error("Could not fetch history");
      }
    }
  }
};
</script>