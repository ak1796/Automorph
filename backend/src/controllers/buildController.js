/**
 * Saved Build Controller
 * Manages user custom vehicle builds stored in My Garage with User-Scoped Isolation.
 */

const mongoose = require('mongoose');
const Build = require('../models/Build');

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback array for builds if MongoDB is offline
let inMemoryBuilds = [
  {
    _id: 'build-demo-1',
    user: null,
    carId: 'bmw-m3',
    carName: 'BMW M3 Competition',
    carImage: '/images/bmw_m3.jpg',
    savedAt: new Date().toISOString().split('T')[0],
    customizations: {
      paint: { id: 'isle_green', name: 'Isle of Man Green', hex: '#154734', price: 0 },
      wheels: { id: 'oem_mesh', name: '19"/20" M Forged Double-Spoke', finish: 'Silver Polish', price: 0 },
      spoiler: { id: 'factory_lip', name: 'Factory Integrated Trunk Lip', price: 0 },
      bodyKit: { id: 'stock_aero', name: 'Standard Factory Aerodynamics', price: 0 },
    },
    totalPrice: 76000,
  },
];

/**
 * @route   GET /api/builds
 * @desc    Get saved vehicle builds (scoped to authenticated user or guest)
 * @access  Public / Private (Optional Auth)
 */
const getBuilds = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const filter = req.user ? { user: req.user._id } : { user: null };
        const builds = await Build.find(filter).sort({ createdAt: -1 });
        return res.json({ status: 'success', count: builds.length, data: builds });
      } catch (e) {
        // Fall through
      }
    }

    const userString = req.user ? (req.user._id || req.user.id).toString() : null;
    const filtered = inMemoryBuilds.filter((b) => (b.user ? b.user.toString() === userString : !userString));
    res.json({ status: 'success', count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/builds/:id
 * @desc    Get a single build by ID (verifies ownership)
 * @access  Public / Private (Optional Auth)
 */
const getBuildById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userString = req.user ? (req.user._id || req.user.id).toString() : null;

    if (isDbConnected()) {
      try {
        const build = await Build.findById(id);
        if (build) {
          // Enforce user isolation if build belongs to a registered user
          if (build.user && (!userString || build.user.toString() !== userString)) {
            return res.status(403).json({
              status: 'error',
              message: "Forbidden: You do not have permission to access another user's build.",
            });
          }
          return res.json({ status: 'success', data: build });
        }
      } catch (e) {
        // Ignore
      }
    }

    const memBuild = inMemoryBuilds.find((b) => b._id === id || b.id === id);
    if (memBuild) {
      if (memBuild.user && (!userString || memBuild.user.toString() !== userString)) {
        return res.status(403).json({
          status: 'error',
          message: "Forbidden: You do not have permission to access another user's build.",
        });
      }
      return res.json({ status: 'success', data: memBuild });
    }

    res.status(404).json({ status: 'error', message: `Build '${id}' not found.` });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/builds
 * @desc    Save a new custom vehicle build to garage (scoped to active user)
 * @access  Public / Private (Optional Auth)
 */
const createBuild = async (req, res, next) => {
  try {
    const { carId, carName, carImage, customizations, totalPrice } = req.body;

    if (!carId || !carName || !customizations || totalPrice === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required build parameters (carId, carName, customizations, totalPrice)',
      });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (isDbConnected()) {
      try {
        const newBuild = await Build.create({
          user: userId,
          userIdString: userId ? userId.toString() : 'guest',
          carId,
          carName,
          carImage,
          customizations,
          totalPrice,
        });

        return res.status(201).json({ status: 'success', data: newBuild });
      } catch (dbErr) {
        // Fall through
      }
    }

    // In-memory fallback
    const mockBuild = {
      _id: `build-${Date.now()}`,
      user: userId,
      carId,
      carName,
      carImage,
      savedAt: new Date().toISOString().split('T')[0],
      customizations,
      totalPrice,
    };
    inMemoryBuilds.unshift(mockBuild);
    return res.status(201).json({ status: 'success', data: mockBuild });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/builds/:id
 * @desc    Update an existing saved build configuration (enforces ownership)
 * @access  Private (Protected)
 */
const updateBuild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customizations, totalPrice } = req.body;
    const userString = req.user ? (req.user._id || req.user.id).toString() : null;

    if (isDbConnected()) {
      try {
        const build = await Build.findById(id);
        if (build) {
          if (build.user && (!userString || build.user.toString() !== userString)) {
            return res.status(403).json({
              status: 'error',
              message: "Forbidden: You do not have permission to modify another user's build.",
            });
          }
          build.customizations = customizations || build.customizations;
          if (totalPrice !== undefined) build.totalPrice = totalPrice;
          await build.save();
          return res.json({ status: 'success', data: build });
        }
      } catch (e) {
        // Fall through
      }
    }

    const index = inMemoryBuilds.findIndex((b) => b._id === id || b.id === id);
    if (index !== -1) {
      if (inMemoryBuilds[index].user && (!userString || inMemoryBuilds[index].user.toString() !== userString)) {
        return res.status(403).json({
          status: 'error',
          message: "Forbidden: You do not have permission to modify another user's build.",
        });
      }
      inMemoryBuilds[index] = {
        ...inMemoryBuilds[index],
        customizations: customizations || inMemoryBuilds[index].customizations,
        totalPrice: totalPrice !== undefined ? totalPrice : inMemoryBuilds[index].totalPrice,
      };
      return res.json({ status: 'success', data: inMemoryBuilds[index] });
    }

    res.status(404).json({ status: 'error', message: `Build '${id}' not found.` });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/builds/:id
 * @desc    Delete a saved build from garage (enforces ownership)
 * @access  Public / Private (Optional Auth)
 */
const deleteBuild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userString = req.user ? (req.user._id || req.user.id).toString() : null;

    if (isDbConnected()) {
      try {
        const build = await Build.findById(id);
        if (build) {
          if (build.user && (!userString || build.user.toString() !== userString)) {
            return res.status(403).json({
              status: 'error',
              message: "Forbidden: You do not have permission to delete another user's build.",
            });
          }
          await Build.findByIdAndDelete(id);
          return res.json({ status: 'success', message: 'Build removed from garage successfully.' });
        }
      } catch (e) {
        // Fall through
      }
    }

    const index = inMemoryBuilds.findIndex((b) => b._id === id || b.id === id);
    if (index !== -1) {
      if (inMemoryBuilds[index].user && (!userString || inMemoryBuilds[index].user.toString() !== userString)) {
        return res.status(403).json({
          status: 'error',
          message: "Forbidden: You do not have permission to delete another user's build.",
        });
      }
      inMemoryBuilds.splice(index, 1);
      return res.json({ status: 'success', message: 'Build removed from garage successfully.' });
    }

    res.json({ status: 'success', message: 'Build removed from garage successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBuilds, getBuildById, createBuild, updateBuild, deleteBuild };
