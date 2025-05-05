const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    enum: ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'Case', 'PowerSupply', 'Cooling']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true
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

// Virtual populate with components
categorySchema.virtual('components', {
  ref: 'Component',
  foreignField: 'category',
  localField: '_id'
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;