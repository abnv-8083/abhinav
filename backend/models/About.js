const mongoose = require('mongoose');

// Single-document store for About content
const AboutSchema = new mongoose.Schema({
  name:            { type: String, default: 'Abhinav A M' },
  headline:        { type: String, default: 'Creative Web Developer' },
  bio:             { type: String, default: '' },
  location:        { type: String, default: 'Kerala, India' },
  focus:           { type: String, default: 'Creative Frontend' },
  status:          { type: String, default: 'Open to Work' },
  available:       { type: Boolean, default: true },
  avatar:          { type: String, default: '' },
  resumeUrl:       { type: String, default: '' },
  bigText:         { type: String, default: "I don't just build websites. I build experiences that move people." },
  introParagraph:  { type: String, default: "I'm a frontend developer focused on creating modern interfaces, interactive experiences and performant web applications." },
  introParagraph2: { type: String, default: "Based in Kerala, India, I combine technical precision with creative thinking to deliver digital products that stand out. I believe the best websites are the ones you feel before you understand." },
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
