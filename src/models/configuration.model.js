const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Configuration must belong to a user']
    },
    name: {
      type: String,
      required: [true, 'Configuration name is required'],
      trim: true
    },
    components: [{
      component: {
        type: mongoose.Schema.ObjectId,
        ref: 'Component',
        required: [true, 'Component is required']
      },
      selectedMerchant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchant'
      },
      price: {
        type: Number,
        required: [true, 'Price is required']
      }
    }],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required']
    },
    public: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Populate user and component info when finding configurations
configurationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'components.component',
    select: 'brand model title category'
  }).populate({
    path: 'components.selectedMerchant',
    select: 'name url'
  });
  next();
});

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;