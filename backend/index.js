const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase init
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- COMMENTS (Supabase) ---
app.get('/api/comments', async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: 'Missing postId' });

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/comments', async (req, res) => {
  const { postId, author, text } = req.body;
  if (!postId || !author || !text) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, author, text }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('ZiiOZ backend is live! 🔥');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
