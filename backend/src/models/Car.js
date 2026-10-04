/**
 * Car Mongoose Schema
 * Represents vehicle catalog models and engineering mechanical specifications.
 * Supports BMW M3 Competition, Toyota GR Supra 3.0, Porsche 911 Carrera S.
 */

const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    carId: {
      type: String,
      required: [true, 'Car identifier is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle model name is required'],
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base MSRP price is required'],
    },
    image: {
      type: String,
      required: [true, 'Vehicle image path is required'],
    },
    accentColor: {
      type: String,
      default: '#1e3a8a',
    },
    specs: {
      horsepower: { type: Number, required: true },
      torqueNm: { type: Number, required: true },
      displacementCi: { type: Number, required: true },
      cylinders: { type: Number, required: true },
      weightLbs: { type: Number, required: true },
      drivetrain: { type: String, required: true },
      transmission: { type: String, required: true },
      topSpeedMph: { type: Number, required: true },
      stockAcceleration060: { type: Number, required: true },
      modelYear: { type: Number, default: 82 },
      origin: { type: Number, default: 2 },
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
