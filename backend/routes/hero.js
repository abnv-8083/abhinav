const express = require('express');
const router  = express.Router();
const Hero    = require('../models/Hero');
const { requireAdmin } = require('../middleware/auth');

// GET hero (public) — always returns the single doc
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({});
    res.json(hero);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update hero (admin)
router.put('/', requireAdmin, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      Object.assign(hero, req.body);
    }
    await hero.save();
    res.json(hero);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
