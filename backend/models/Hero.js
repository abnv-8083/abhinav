const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  // Status badge
  statusBadge:   { type: String, default: 'Available for freelance' },
  // Name
  name:          { type: String, default: 'Abhinav A M' },
  // Headline — 3 lines, second one is lime
  headlineLine1: { type: String, default: 'CREATIVE' },
  headlineLine2: { type: String, default: 'WEB' },
  headlineLine3: { type: String, default: 'DEVELOPER.' },
  // Sub text
  subtitle:      { type: String, default: 'I build immersive digital experiences where code, motion and design meet.' },
  // Meta info bar
  location:      { type: String, default: 'Kerala, India' },
  focus:         { type: String, default: 'Creative Frontend' },
  status:        { type: String, default: 'Open to Work' },
}, { timestamps: true });

module.exports = mongoose.model('Hero', HeroSchema);
