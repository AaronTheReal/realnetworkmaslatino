import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const FavoriteSchema = new Schema({
  contentId: {
    type: Types.ObjectId,
    required: true
  },
  contentType: {
    type: String,
    enum: ['Noticia', 'Podcast', 'Radio'],
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const UserSchema = new Schema({
  provider: {
    type: String,
    enum: ['email', 'google', 'facebook', 'apple', 'microsoft'],
    required: true
  },
  providerId: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  password: { type: String, required: function () { return this.provider === 'email'; } },
  avatar: { type: String, trim: true },

  categories: [{
    type: String,
    enum: ['Mundo', 'Arte', 'Politica', 'Finanzas', 'Familia', 'Deportes', 'Salud'],
    required: true
  }],
  language: {
    type: String,
    enum: ['es', 'en', 'fr', 'pt'],
    default: 'es'
  },

  favorites: [FavoriteSchema],

  createdAt: { type: Date, default: Date.now }
});

export default model('User', UserSchema);
