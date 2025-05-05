const Joi = require('joi');

// Create product validation schema
const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 100 characters'
    }),
  
  description: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Product description must be at least 10 characters',
      'string.max': 'Product description cannot exceed 2000 characters'
    }),
  
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
  
  category: Joi.string().valid('electronics', 'clothing', 'food', 'books', 'other').required()
    .messages({
      'string.empty': 'Category is required',
      'any.only': 'Category must be one of: electronics, clothing, food, books, or other'
    }),
  
  stock: Joi.number().integer().min(0).default(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),
  
  featured: Joi.boolean().default(false),
  
  image: Joi.string().default('default.jpg')
});

// Update product validation schema (same as create but all fields optional)
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 100 characters'
    }),
  
  description: Joi.string().trim().min(10).max(2000)
    .messages({
      'string.min': 'Product description must be at least 10 characters',
      'string.max': 'Product description cannot exceed 2000 characters'
    }),
  
  price: Joi.number().min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative'
    }),
  
  category: Joi.string().valid('electronics', 'clothing', 'food', 'books', 'other')
    .messages({
      'any.only': 'Category must be one of: electronics, clothing, food, books, or other'
    }),
  
  stock: Joi.number().integer().min(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),
  
  featured: Joi.boolean(),
  
  image: Joi.string()
});

module.exports = {
  createProductSchema,
  updateProductSchema
};