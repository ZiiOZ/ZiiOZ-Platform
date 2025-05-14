const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy in-memory data (no DB yet)
const posts = [
  { id: 1, content: 'First post on ZiiOZ!', author: 'Westley' },
  { id: 2, content: 'Loving the new API 🚀', author: 'Tillie' },
  { id: 3, content: 'Ready to change the game.', author: 'Maddie' }
];

const users = [
  { id: 1, name: 'Westley', role: 'Founder' },
  { id: 2, name: 'Tillie', role: 'Visionary' },
  { id: 3, name: 'Maddie', role: 'Creative Lead' }
];

// Root test
app.get('/', (req, res) => {
  res.send('ZiiOZ backend is live! 🔥');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from ZiiOZ backend 👋' });
});

// 🧠 Posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { content, author } = req.body;
  if (!content || !author) {
    return res.status(400).json({ error: 'Missing content or author' });
  }
  const newPost = {
    id: posts.length + 1,
    content,
    author
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 👥 Users
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Missing name or role' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    role
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
