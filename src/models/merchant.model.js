const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Merchant name is required'],
    unique: true,
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Website URL is required'],
    unique: true
  },
  apiKey: {
    type: String,
    required: [true, 'API key is required'],
    select: false
  },
  commissionRate: {
    type: Number,
    required: [true, 'Commission rate is required'],
    min: 0,
    max: 100
  },
  active: {
    type: Boolean,
    default: true
  },
  syncFrequency: {
    type: String,
    enum: ['hourly', 'daily', 'weekly'],
    default: 'daily'
  },
  lastSync: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate with prices
merchantSchema.virtual('prices', {
  ref: 'Price',
  foreignField: 'merchant',
  localField: '_id'
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;