const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  subtitle:    { type: String, default: '' },
  description: { type: String, default: '' },
  problem:     { type: String, default: '' },
  solution:    { type: String, default: '' },
  features:    [String],
  tech:        [String],
  year:        { type: String, default: '' },
  role:        { type: String, default: '' },
  github:      { type: String, default: '' },
  live:        { type: String, default: '' },
  image:       { type: String, default: '' },      // Cloudinary URL
  color:       { type: String, default: '#c8ff00' },
  accentColor: { type: String, default: 'rgba(200,255,0,0.1)' },
  bgGradient:  { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
