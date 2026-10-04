/**
 * Build Mongoose Schema
 * Represents saved custom vehicle configurations stored in My Garage.
 */

const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest builds
    },
    userIdString: {
      type: String,
      default: 'guest',
    },
    carId: {
      type: String,
      required: [true, 'Car model ID is required'],
    },
    carName: {
      type: String,
      required: [true, 'Car model name is required'],
    },
    carImage: {
      type: String,
    },
    customizations: {
      paint: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        hex: { type: String, required: true },
        price: { type: Number, default: 0 },
      },
      wheels: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        finish: { type: String, default: '' },
        price: { type: Number, default: 0 },
      },
      spoiler: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
      },
      bodyKit: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total build price is required'],
    },
    savedAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Build', buildSchema);
