import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const CarouselItemSchema = new Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 400 },
  type: {
    type: String,
    enum: ['podcast', 'noticia', 'reel', 'video', 'evento', 'custom'],
    required: true,
  },
  coverImage: { type: String, required: true },
  videoUrl: { type: String },
  audioUrl: { type: String },
  linkUrl: { type: String },
  // 🔥 NUEVOS CAMPOS
  iframeUrl: { type: String, default: null },
  embedProvider: {
    type: String,
    enum: ['youtube', 'facebook', 'spotify', 'tiktok', 'vimeo', 'soundcloud', 'instagram', 'custom', null],
    default: null,
  },

  relatedId: { type: Types.ObjectId, refPath: 'type' },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [String],
}, {
  timestamps: true,
});
// Validator custom en schema (se ejecuta antes de save)
CarouselItemSchema.pre('validate', function(next) {
  const { type, linkUrl, videoUrl, audioUrl } = this;

  if (type === 'reel' && (!linkUrl || linkUrl.trim() === '')) {
    return next(new Error('linkUrl es requerido para tipo "reel"'));
  }
  if (type === 'video' && (!videoUrl || videoUrl.trim() === '')) {
    return next(new Error('videoUrl es requerido para tipo "video"'));
  }
  if (type === 'podcast' && (!audioUrl || audioUrl.trim() === '')) {
    return next(new Error('audioUrl es requerido para tipo "podcast"'));
  }
  if (['noticia', 'evento', 'custom'].includes(type) && (!linkUrl || linkUrl.trim() === '')) {
    return next(new Error('linkUrl es requerido para este tipo'));
  }

  next();
});

import { computeIframeUrl, detectProvider } from '../utils/embed.js';

CarouselItemSchema.pre('save', async function(next) {
  // Solo autogenera si no lo mandaste tú explícito
  if (!this.iframeUrl) {
    const { iframeUrl, provider } = await computeIframeUrl({
      type: this.type,
      videoUrl: this.videoUrl,
      audioUrl: this.audioUrl,
      linkUrl: this.linkUrl,
    });
    this.iframeUrl = iframeUrl || null;
    this.embedProvider = provider || null;
  }
  next();
});

export default model('CarouselItem', CarouselItemSchema);