// Load .env when running directly (local dev); Vercel injects env vars automatically
if (require.main === module) require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Middleware ────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) or from allowed origins
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for write routes
const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', writeLimiter);

// ── Routes ────────────────────────────────────────────────
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/skills',       require('./routes/skills'));
app.use('/api/journey',      require('./routes/journey'));
app.use('/api/about',        require('./routes/about'));
app.use('/api/social-links', require('./routes/socialLinks'));
app.use('/api/upload',       require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── DB connection (cached for serverless) ──────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('✅ MongoDB connected');
}

// ── Export for Vercel serverless / run locally ─────────────
if (require.main === module) {
  // Local dev: connect then listen
  const PORT = process.env.PORT || 4000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`)))
    .catch(err => { console.error('❌ DB error:', err.message); process.exit(1); });
} else {
  // Vercel serverless: connect on each cold start then hand off to express
  module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
  };
}
