const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
  
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      'string.empty': 'Password confirmation is required',
      'any.only': 'Passwords do not match'
    }),
  
  role: Joi.string().valid('user', 'admin').default('user')
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema
};