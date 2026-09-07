const express = require('express');
const router = express.Router();
const SkillCategory = require('../models/SkillCategory');
const { requireAdmin } = require('../middleware/auth');

// GET all skill categories (public)
router.get('/', async (req, res) => {
  try {
    const skills = await SkillCategory.find().sort({ order: 1, createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create category (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const cat = new SkillCategory(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update category (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const cat = await SkillCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE category (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const cat = await SkillCategory.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
