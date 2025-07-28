// models/VoiceMember.js
import mongoose from 'mongoose';

const voiceMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    socials: {
      instagram: { type: String, trim: true },
      twitter:   { type: String, trim: true },
      tiktok:    { type: String, trim: true },
      facebook:  { type: String, trim: true },
      youtube:   { type: String, trim: true },
      website:   { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Opcional: limpiar el JSON que devuelves al frontend
voiceMemberSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const VoiceMember = mongoose.model('VoiceMember', voiceMemberSchema);
export default VoiceMember;
