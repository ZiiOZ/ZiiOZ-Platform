const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('ZiiOZ backend is live! 🔥');
});

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from ZiiOZ backend 👋' });
});

// 📄 Posts route
app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'First post on ZiiOZ!', author: 'Westley' },
    { id: 2, content: 'Loving the new API 🚀', author: 'Tillie' },
    { id: 3, content: 'Ready to change the game.', author: 'Maddie' }
  ]);
});

// 👥 Users route
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Westley', role: 'Founder' },
    { id: 2, name: 'Tillie', role: 'Visionary' },
    { id: 3, name: 'Maddie', role: 'Creative Lead' }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
