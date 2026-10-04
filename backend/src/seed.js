/**
 * Database Seeder Script
 * Run this script to populate MongoDB (Local or MongoDB Atlas) with initial vehicle models and sample builds.
 * Usage: node src/seed.js
 */

const dns = require('dns');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Car = require('./models/Car');
const Build = require('./models/Build');
const { INITIAL_CARS } = require('./controllers/carController');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const INITIAL_BUILDS = [
  {
    carId: 'porsche-911',
    carName: 'Porsche 911 Carrera S',
    carImage: '/images/porsche_911.jpg',
    savedAt: new Date().toISOString().split('T')[0],
    customizations: {
      paint: { id: 'miami_blue', name: 'Miami Riviera Blue', hex: '#0284c7', price: 1500 },
      wheels: { id: 'carbon_aero', name: '21" Carbon Composite Aerodynamic', finish: 'Carbon Weave', price: 3800 },
      spoiler: { id: 'gt_track_wing', name: 'GT3 High-Downforce Rear Wing', price: 2800 },
      bodyKit: { id: 'track_aerokit', name: 'Widebody Track Aerokit', price: 5900 },
    },
    totalPrice: 144700,
  },
  {
    carId: 'bmw-m3',
    carName: 'BMW M3 Competition',
    carImage: '/images/bmw_m3.jpg',
    savedAt: new Date().toISOString().split('T')[0],
    customizations: {
      paint: { id: 'isle_green', name: 'Isle of Man Green', hex: '#154734', price: 0 },
      wheels: { id: 'gloss_black', name: '20" Satin Black Performance Alloy', finish: 'Gloss Black', price: 1250 },
      spoiler: { id: 'carbon_ducktail', name: 'Carbon Fiber Ducktail Spoiler', price: 950 },
      bodyKit: { id: 'm_perf_package', name: 'M Performance Carbon Package', price: 3200 },
    },
    totalPrice: 81400,
  },
];

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/automorph';

  try {
    console.log(`[Seed Script] Connecting to MongoDB: ${mongoURI.split('@').pop() || mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('[Seed Script] Connected to MongoDB successfully.');

    // Clear existing car & build collections
    await Car.deleteMany({});
    await Build.deleteMany({});
    console.log('[Seed Script] Cleared existing collections.');

    // Seed Cars
    const insertedCars = await Car.insertMany(INITIAL_CARS);
    console.log(`[Seed Script] Successfully seeded ${insertedCars.length} Car documents into MongoDB!`);

    // Seed Sample Builds
    const insertedBuilds = await Build.insertMany(INITIAL_BUILDS);
    console.log(`[Seed Script] Successfully seeded ${insertedBuilds.length} Garage Build documents into MongoDB!`);

    console.log('\n[Seed Script] MongoDB Database is now fully populated!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
