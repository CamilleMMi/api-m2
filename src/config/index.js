const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration object
const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  // MongoDB
  mongoURI: process.env.MONGODB_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

module.exports = config;