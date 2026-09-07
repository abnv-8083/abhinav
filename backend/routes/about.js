const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { requireAdmin } = require('../middleware/auth');

// GET about (public) — always returns the single doc
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Create default doc if none exists
      about = await About.create({});
    }
    res.json(about);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update about (admin)
router.put('/', requireAdmin, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    await about.save();
    res.json(about);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
