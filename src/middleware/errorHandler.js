const { logger } = require('../utils/logger');
const AppError = require('../utils/appError');

/**
 * Handle specific known errors
 */

// MongoDB duplicate key error
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// MongoDB validation error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Mongoose cast error
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// JWT error
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

// JWT expired error
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

// Development error response
const sendErrorDev = (err, res) => {
  logger.error('ERROR 💥', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.error('Operational ERROR 💥', err.message);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    logger.error('Unknown ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;