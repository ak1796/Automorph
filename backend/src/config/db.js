/**
 * Database Configuration & Mongoose Connection Handler
 * Connects Express application to MongoDB instance (Local or Atlas Cloud).
 */

const dns = require('dns');
const mongoose = require('mongoose');

// Configure public DNS resolvers to prevent Windows SRV lookup failures on Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/automorph';

  try {
    // Disable command buffering when disconnected to prevent hanging
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection attempt failed: ${error.message}`);
    console.warn(`[Database Warning] Express server running in standalone/fallback mode.`);
    return null;
  }
};

module.exports = connectDB;
