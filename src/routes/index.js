const express = require('express');
const todoRoutes = require('./todoRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount todo routes
router.use('/', todoRoutes);

module.exports = router;
