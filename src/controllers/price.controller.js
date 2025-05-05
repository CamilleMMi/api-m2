const Price = require('../models/price.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPrices = catchAsync(async (req, res) => {
  const prices = await Price.find()
    .populate('component')
    .populate('merchant');
  
  res.status(200).json({
    status: 'success',
    results: prices.length,
    data: { prices }
  });
});

exports.getPrice = catchAsync(async (req, res, next) => {
  const price = await Price.findById(req.params.id)
    .populate('component')
    .populate('merchant');
  
  if (!price) {
    return next(new AppError('Price not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { price }
  });
});

exports.createPrice = catchAsync(async (req, res) => {
  const price = await Price.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { price }
  });
});

exports.updatePrice = catchAsync(async (req, res, next) => {
  const price = await Price.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!price) {
    return next(new AppError('Price not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { price }
  });
});

exports.deletePrice = catchAsync(async (req, res, next) => {
  const price = await Price.findByIdAndDelete(req.params.id);
  
  if (!price) {
    return next(new AppError('Price not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});