const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },   // 'GitHub', 'LinkedIn', etc.
  label:    { type: String, default: '' },
  href:     { type: String, required: true },
  value:    { type: String, default: '' },       // display text
  icon:     { type: String, default: 'Globe' },  // lucide icon name
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', SocialLinkSchema);
