const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Component must belong to a category']
  },
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  specifications: {
    type: Map,
    of: String,
    required: [true, 'Specifications are required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better search performance
componentSchema.index({ brand: 1, model: 1 });
componentSchema.index({ category: 1 });

// Virtual populate with prices
componentSchema.virtual('prices', {
  ref: 'Price',
  foreignField: 'component',
  localField: '_id'
});

const Component = mongoose.model('Component', componentSchema);

module.exports = Component;