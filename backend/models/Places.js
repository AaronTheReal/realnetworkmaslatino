// models/BestRestaurants.js
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },           // URL lista para usar en <img>
  authorName: String,                              // opcional (para atribución)
  authorUri: String,                               // opcional
});

const RestaurantSchema = new mongoose.Schema({
  placeId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  formattedAddress: String,
  rating: Number,
  priceLevel: String,          // PRICE_LEVEL_MODERATE, PRICE_LEVEL_EXPENSIVE, etc.
  googleMapsUri: String,
  photos: [PhotoSchema],       // Array de fotos
  lastUpdated: { type: Date, default: Date.now }
});

const BestRestaurantsSchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  }, 
  // Ejemplos: "boston", "atlanta", "new-york", etc.
  
  restaurants: [RestaurantSchema],
  
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Índice para búsquedas rápidas
BestRestaurantsSchema.index({ city: 1 });

module.exports = mongoose.model('BestRestaurants', BestRestaurantsSchema);