/**
 * Express Saved Builds / My Garage Routes
 * Mounted at /api/builds
 */

const express = require('express');
const router = express.Router();
const { getBuilds, getBuildById, createBuild, updateBuild, deleteBuild } = require('../controllers/buildController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getBuilds);
router.get('/:id', optionalAuth, getBuildById);
router.post('/', optionalAuth, createBuild);
router.put('/:id', protect, updateBuild);
router.delete('/:id', optionalAuth, deleteBuild);

module.exports = router;
