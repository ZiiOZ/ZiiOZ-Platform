const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let posts = [
  { id: 1, content: "First post on ZiiOZ!", author: "Westley" },
  { id: 2, content: "Loving the new API 🚀", author: "Tillie" },
  { id: 3, content: "Ready to change the game.", author: "Maddie" }
];

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from ZiiOZ backend 👋" });
});

// GET all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// POST a new post
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

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
