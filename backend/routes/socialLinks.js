const express = require('express');
const router = express.Router();
const SocialLink = require('../models/SocialLink');
const { requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const links = await SocialLink.find({ active: true }).sort({ order: 1 });
    res.json(links);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const link = new SocialLink(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json(link);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
