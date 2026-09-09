const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  page:      { type: String, required: true },   // '/project/ecommerce-platform'
  slug:      { type: String, default: null },     // 'ecommerce-platform' or null
  visitorId: { type: String, required: true },    // SHA-256 hashed IP
  referrer:  { type: String, default: '' },
}, { timestamps: true });

// Index for fast time-based queries
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ slug: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
