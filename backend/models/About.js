const mongoose = require('mongoose');

// Single-document store for About content
const AboutSchema = new mongoose.Schema({
  name:      { type: String, default: 'Abhinav A M' },
  headline:  { type: String, default: 'Creative Web Developer' },
  bio:       { type: String, default: '' },
  location:  { type: String, default: 'Kerala, India' },
  focus:     { type: String, default: 'Creative Frontend' },
  status:    { type: String, default: 'Open to Work' },
  available: { type: Boolean, default: true },
  avatar:    { type: String, default: '' },  // Cloudinary URL
  resumeUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
