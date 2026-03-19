<template>
  <div class="container">
    <header class="form-header">
      <h2>Mood Check-in</h2>
      <p class="subtitle">How are you feeling today?</p>
    </header>

    <div class="form-card">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          id="name"
          v-model="name" 
          placeholder="Enter your name" 
          :disabled="loading" 
        />
      </div>

      <div class="form-group">
        <label for="mood">Your Mood</label>
        <textarea 
          id="mood"
          v-model="mood" 
          placeholder="Share your thoughts..." 
          :disabled="loading"
        ></textarea>
      </div>

      <button @click="submitMood" :disabled="loading || !name || !mood" class="submit-btn">
        <span v-if="loading">💬 Processing...</span>
        <span v-else>Submit Entry</span>
      </button>
    </div>

    <transition name="fade">
      <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
    </transition>

    <div v-if="aiMessage" class="ai-box">
      <div class="ai-header">
        <span class="ai-icon">✨</span>
        <strong>AI Advisor</strong>
      </div>
      <p>{{ aiMessage }}</p>
    </div>

    <section class="history-section">
      <div class="history-header">
        <h3>Mood History</h3>
        <button @click="fetchHistory" class="refresh-btn">🔄 Refresh</button>
      </div>

      <div class="table-container">
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
              <td class="font-bold">{{ entry.full_name }}</td>
              <td>{{ entry.mood_text }}</td>
              <td class="ai-cell">{{ entry.ai_message }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <p>No history found yet. Start by sharing your mood!</p>
        </div>
      </div>
    </section>
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
          user_id: 1, 
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

<style scoped>
/* Main Layout */
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8f9fa; /* Neutral Light Grey */
  font-family: 'Inter', -apple-system, sans-serif;
  color: #334155;
  border-radius: 16px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #1e293b;
  font-size: 2rem;
  margin-bottom: 5px;
}

.subtitle {
  color: #64748b;
}

/* Form Card */
.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #475569;
}

input, textarea {
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #a8dadc; /* Soft Teal */
  box-shadow: 0 0 0 3px rgba(168, 218, 220, 0.2);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Buttons */
.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #457b9d; /* Deep Teal */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d3557;
}

.refresh-btn {
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

/* AI Feedback Box */
.ai-box {
  background: #f0f9ff;
  border-left: 5px solid #a8dadc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #0c4a6e;
}

/* History Section */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  background-color: #f8fafc;
  text-align: left;
  padding: 15px;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 2px solid #f1f5f9;
}

.history-table td {
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.ai-cell {
  color: #475569;
  font-style: italic;
  font-size: 0.9rem;
}

.error-msg {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.font-bold { font-weight: 600; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>