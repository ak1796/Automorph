/**
 * Vehicle Catalogue Controller
 * Manages automotive model data and mechanical specifications.
 * Automatically seeds MongoDB with benchmark models if database is empty.
 */

const mongoose = require('mongoose');
const Car = require('../models/Car');

// Default car catalogue matching frontend & ML specifications
const INITIAL_CARS = [
  {
    carId: 'bmw-m3',
    name: 'BMW M3 Competition',
    manufacturer: 'BMW',
    tagline: 'High-Performance Sports Sedan with Pure Motorsport Pedigree',
    basePrice: 76000,
    image: '/images/bmw_m3.jpg',
    accentColor: '#1e3a8a',
    specs: {
      horsepower: 503,
      torqueNm: 650,
      displacementCi: 183,
      cylinders: 6,
      weightLbs: 3890,
      drivetrain: 'RWD / xDrive',
      transmission: '8-Speed M Steptronic',
      topSpeedMph: 180,
      stockAcceleration060: 3.8,
      modelYear: 82,
      origin: 2,
    },
    description: 'The BMW M3 Competition represents the pinnacle of performance sedan engineering. Powered by an M TwinPower Turbo 3.0-liter inline 6-cylinder engine delivering 503 HP.',
  },
  {
    carId: 'toyota-supra',
    name: 'Toyota GR Supra 3.0',
    manufacturer: 'Toyota',
    tagline: 'Purist Performance Coupe Engineered for Track & Street Precision',
    basePrice: 57500,
    image: '/images/toyota_supra.jpg',
    accentColor: '#b91c1c',
    specs: {
      horsepower: 382,
      torqueNm: 500,
      displacementCi: 183,
      cylinders: 6,
      weightLbs: 3400,
      drivetrain: 'RWD',
      transmission: '6-Speed Manual / 8-Speed Auto',
      topSpeedMph: 155,
      stockAcceleration060: 3.9,
      modelYear: 82,
      origin: 3,
    },
    description: 'Designed from the ground up to deliver uncompromised driving pleasure, combining a 382 HP turbocharged 3.0L engine with 50:50 weight balance.',
  },
  {
    carId: 'porsche-911',
    name: 'Porsche 911 Carrera S',
    manufacturer: 'Porsche',
    tagline: 'The Benchmark Rear-Engine Sports Car for Timeless Performance',
    basePrice: 131300,
    image: '/images/porsche_911.jpg',
    accentColor: '#c2410c',
    specs: {
      horsepower: 443,
      torqueNm: 530,
      displacementCi: 182,
      cylinders: 6,
      weightLbs: 3350,
      drivetrain: 'RWD',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)',
      topSpeedMph: 191,
      stockAcceleration060: 3.5,
      modelYear: 82,
      origin: 2,
    },
    description: 'The quintessential sports car. With its twin-turbo flat-six engine mounted behind the rear axle, yielding unmatched traction and dynamics.',
  },
  {
    carId: 'nissan-gtr',
    name: 'Nissan GT-R Nismo',
    manufacturer: 'Nissan',
    tagline: 'The Legendary Supercar Killer with ATTESA E-TS All-Wheel Traction',
    basePrice: 221000,
    image: '/images/nissan_gtr.jpg',
    accentColor: '#dc2626',
    specs: {
      horsepower: 600,
      torqueNm: 652,
      displacementCi: 232,
      cylinders: 6,
      weightLbs: 3865,
      drivetrain: 'ATTESA E-TS AWD',
      transmission: '6-Speed Dual-Clutch',
      topSpeedMph: 205,
      stockAcceleration060: 2.9,
      modelYear: 82,
      origin: 3,
    },
    description: 'Godzilla returns with hand-built VR38DETT twin-turbo V6 power, carbon aerodynamic bodywork, and relentless cornering grip.',
  },
  {
    carId: 'corvette-c8',
    name: 'Chevrolet Corvette C8 Z06',
    manufacturer: 'Chevrolet',
    tagline: 'Mid-Engine American Supercar featuring LT6 Flat-Plane V8 Power',
    basePrice: 106500,
    image: '/images/corvette_c8.jpg',
    accentColor: '#eab308',
    specs: {
      horsepower: 670,
      torqueNm: 624,
      displacementCi: 335,
      cylinders: 8,
      weightLbs: 3434,
      drivetrain: 'RWD',
      transmission: '8-Speed Dual-Clutch',
      topSpeedMph: 195,
      stockAcceleration060: 2.6,
      modelYear: 82,
      origin: 1,
    },
    description: 'The C8 Z06 redefines American performance with a naturally aspirated 5.5L flat-plane V8 screaming to an 8,600 RPM redline.',
  },
  {
    carId: 'ford-mustang',
    name: 'Ford Mustang Shelby GT500',
    manufacturer: 'Ford',
    tagline: 'Raw Muscle Power with 760 HP Supercharged Predator V8 Engine',
    basePrice: 79400,
    image: '/images/ford_mustang.jpg',
    accentColor: '#2563eb',
    specs: {
      horsepower: 760,
      torqueNm: 847,
      displacementCi: 317,
      cylinders: 8,
      weightLbs: 4171,
      drivetrain: 'RWD',
      transmission: '7-Speed Tremec Dual-Clutch',
      topSpeedMph: 180,
      stockAcceleration060: 3.3,
      modelYear: 82,
      origin: 1,
    },
    description: 'The pinnacle of Mustang performance. Featuring a 2.65L Eaton supercharger bolted onto a 5.2L cross-plane V8 for unmatched quarter-mile acceleration.',
  },
  {
    carId: 'audi-r8',
    name: 'Audi R8 V10 Performance',
    manufacturer: 'Audi',
    tagline: 'High-Revving Naturally Aspirated V10 Mid-Engine Exotic',
    basePrice: 158600,
    image: '/images/audi_r8.jpg',
    accentColor: '#0284c7',
    specs: {
      horsepower: 602,
      torqueNm: 560,
      displacementCi: 317,
      cylinders: 10,
      weightLbs: 3594,
      drivetrain: 'Quattro AWD',
      transmission: '7-Speed S tronic Dual-Clutch',
      topSpeedMph: 205,
      stockAcceleration060: 3.1,
      modelYear: 82,
      origin: 2,
    },
    description: 'Shared motorsport architecture with GT3 racers. The Audi R8 combines a spine-tingling 5.2L FSI V10 with Quattro dynamic all-wheel drive.',
  },
  {
    carId: 'lamborghini-huracan',
    name: 'Lamborghini Huracán EVO',
    manufacturer: 'Lamborghini',
    tagline: 'Unadulterated Italian Supercar Emotion with Active Aerodynamics',
    basePrice: 208000,
    image: '/images/lamborghini_huracan.jpg',
    accentColor: '#16a34a',
    specs: {
      horsepower: 631,
      torqueNm: 600,
      displacementCi: 317,
      cylinders: 10,
      weightLbs: 3135,
      drivetrain: 'AWD',
      transmission: '7-Speed Dual-Clutch',
      topSpeedMph: 202,
      stockAcceleration060: 2.9,
      modelYear: 82,
      origin: 2,
    },
    description: 'Razor-sharp Italian design backed by LDVI predictive dynamics, titanium intake valves, and a screaming 631 HP V10.',
  },
];

/**
 * Auto-seeds MongoDB database with car models if empty.
 */
const seedCarsIfEmpty = async () => {
  if (mongoose.connection.readyState !== 1) {
    return; // Don't attempt to seed if MongoDB connection is not active
  }
  try {
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('[MongoDB Auto-Seed] Database is empty. Seeding initial vehicle catalog...');
      await Car.insertMany(INITIAL_CARS);
      console.log('[MongoDB Auto-Seed] Successfully inserted 3 vehicle models into MongoDB!');
    }
  } catch (err) {
    console.warn('[MongoDB Auto-Seed Warning] Could not seed database:', err.message);
  }
};

/**
 * @route   GET /api/cars
 * @desc    Fetch all available car models in catalog
 * @access  Public
 */
const getCars = async (req, res, next) => {
  try {
    await seedCarsIfEmpty();
    const cars = await Car.find();
    if (cars && cars.length > 0) {
      return res.json({ status: 'success', count: cars.length, data: cars });
    }
    // Return fallback catalog if DB query empty
    res.json({ status: 'success', count: INITIAL_CARS.length, data: INITIAL_CARS });
  } catch (error) {
    // Return fallback catalog if DB connection offline
    res.json({ status: 'success', count: INITIAL_CARS.length, data: INITIAL_CARS });
  }
};

/**
 * @route   GET /api/cars/:id
 * @desc    Fetch a single car model by carId
 * @access  Public
 */
const getCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findOne({ carId: id });
    if (car) {
      return res.json({ status: 'success', data: car });
    }

    const fallbackCar = INITIAL_CARS.find((c) => c.carId === id);
    if (fallbackCar) {
      return res.json({ status: 'success', data: fallbackCar });
    }

    res.status(404).json({ status: 'error', message: `Car model '${id}' not found.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, getCarById, seedCarsIfEmpty, INITIAL_CARS };
