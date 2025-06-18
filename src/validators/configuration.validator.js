const Joi = require('joi');

// Create configuration validation schema
const createConfigurationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Configuration name is required',
      'string.min': 'Configuration name must be at least 2 characters',
      'string.max': 'Configuration name cannot exceed 100 characters'
    }),
  
  components: Joi.array().items(
    Joi.object({
      component: Joi.string().required()
        .messages({
          'string.empty': 'Component ID is required'
        }),
      selectedMerchant: Joi.string().optional(),
      price: Joi.number().min(0).required()
        .messages({
          'number.base': 'Price must be a number',
          'number.min': 'Price cannot be negative',
          'any.required': 'Price is required'
        })
    })
  ).min(1).required()
    .messages({
      'array.min': 'At least one component is required',
      'any.required': 'Components are required'
    }),
  
  public: Joi.boolean().default(false),
  
  notes: Joi.string().max(1000).optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

// Update configuration validation schema
const updateConfigurationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.min': 'Configuration name must be at least 2 characters',
      'string.max': 'Configuration name cannot exceed 100 characters'
    }),
  
  components: Joi.array().items(
    Joi.object({
      component: Joi.string().required(),
      selectedMerchant: Joi.string().optional(),
      price: Joi.number().min(0).required()
    })
  ).min(1)
    .messages({
      'array.min': 'At least one component is required'
    }),
  
  public: Joi.boolean(),
  
  notes: Joi.string().max(1000)
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

// Calculate price validation schema
const calculatePriceSchema = Joi.object({
  components: Joi.array().items(
    Joi.object({
      component: Joi.string().required(),
      selectedMerchant: Joi.string().optional(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required()
    .messages({
      'array.min': 'At least one component is required',
      'any.required': 'Components are required'
    })
});

module.exports = {
  createConfigurationSchema,
  updateConfigurationSchema,
  calculatePriceSchema
};