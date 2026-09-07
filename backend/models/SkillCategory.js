const mongoose = require('mongoose');

const SkillItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  level: { type: Number, default: 80, min: 0, max: 100 },
  desc:  { type: String, default: '' },
});

const SkillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  order:    { type: Number, default: 0 },
  items:    [SkillItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('SkillCategory', SkillCategorySchema);
