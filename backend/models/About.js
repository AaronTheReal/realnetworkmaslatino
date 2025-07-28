// models/AboutPage.js
const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
  title: { type: String, default: "About Us" },
  subtitle: String,
  blocks: [{
    heading: String,
    content: String,
    image: String, // opcional
    order: Number
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AboutPage', aboutPageSchema);
