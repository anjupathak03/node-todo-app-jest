require('dotenv').config();

const app = require('./app');
const config = require('./config');
const db = require('./database');

const startServer = async () => {
  try {
    // Initialize database
    db.initPool();
    await db.createTodosTable();

    // Start server
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
      console.log(`Environment: ${config.server.env}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await db.closePool();
  process.exit(0);
});

startServer();
