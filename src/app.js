const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const { logger, morganStream } = require('./utils/logger');
const routes = require('./routes');

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Request logging
app.use(morgan('combined', { stream: morganStream }));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running'
  });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node API',
      version: '1.0.0',
      description: 'A professional Node.js REST API',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

module.exports = app;