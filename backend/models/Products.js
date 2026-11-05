// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    price: { type: Number, required: true, min: 0 },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    /* ── Category — free-form string, no enum ── */
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    sizes: { type: [Number], default: [] },
    badge:  { type: String, default: '' },
    images: { type: [String], default: [] },

    rating:  { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    /* Kept for card thumbnails / backward compatibility */
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);