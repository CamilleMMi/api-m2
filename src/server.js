const app = require('./app');
const config = require('./config');
const { logger } = require('./utils/logger');
const { connectDB } = require('./config/database');

// Connect to database
connectDB();

const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});