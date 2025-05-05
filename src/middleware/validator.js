const Joi = require('joi');
const AppError = require('../utils/appError');

/**
 * Validates request data based on provided schema
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate (body, params, query)
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

module.exports = validate;