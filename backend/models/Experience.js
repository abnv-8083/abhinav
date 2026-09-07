const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  year:        { type: String, required: true },
  title:       { type: String, required: true },
  role:        { type: String, default: '' },
  description: { type: String, default: '' },
  highlights:  [String],
  type:        { type: String, enum: ['learning', 'growth', 'milestone', 'current'], default: 'growth' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  tags:        [String],
  order:       { type: Number, default: 0 },
}, { timestamps: true });

const Experience = mongoose.model('Experience', ExperienceSchema);
const Service    = mongoose.model('Service', ServiceSchema);

module.exports = { Experience, Service };
