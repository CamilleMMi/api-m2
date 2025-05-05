const mongoose = require('mongoose');
const config = require('./index');
const { logger } = require('../utils/logger');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };