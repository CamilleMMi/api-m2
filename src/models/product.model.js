const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
      maxlength: [100, 'A product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true,
      maxlength: [2000, 'A product description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be above 0']
    },
    category: {
      type: String,
      required: [true, 'A product must have a category'],
      enum: {
        values: ['electronics', 'clothing', 'food', 'books', 'other'],
        message: 'Category is either: electronics, clothing, food, books, or other'
      }
    },
    stock: {
      type: Number,
      required: [true, 'A product must have stock information'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    },
    featured: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: 'default.jpg'
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a user']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for better search performance
productSchema.index({ name: 'text', description: 'text' });

// Populate user information when finding products
productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: 'name'
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;