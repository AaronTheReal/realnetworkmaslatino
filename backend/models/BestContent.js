// models/CarouselItem.js
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const CarouselItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 400,
  },
  type: {
    type: String,
    enum: ['podcast', 'noticia', 'reel', 'video', 'evento', 'custom'],
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  linkUrl: {
    type: String,
    required: true,
  },
  relatedId: {
    type: Types.ObjectId,
    refPath: 'type', // Si el tipo es podcast, noticia, etc.
  },
  position: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default model('CarouselItem', CarouselItemSchema);
