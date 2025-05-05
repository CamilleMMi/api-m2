const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  component: {
    type: mongoose.Schema.ObjectId,
    ref: 'Component',
    required: [true, 'Price must be associated with a component']
  },
  merchant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Merchant',
    required: [true, 'Price must be associated with a merchant']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  url: {
    type: String,
    required: [true, 'Product URL is required']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique price per component per merchant
priceSchema.index({ component: 1, merchant: 1 }, { unique: true });

// Pre-save middleware to update lastUpdated
priceSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;