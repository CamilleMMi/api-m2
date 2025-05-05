const Merchant = require('../models/merchant.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllMerchants = catchAsync(async (req, res) => {
  const merchants = await Merchant.find({ active: true });
  
  res.status(200).json({
    status: 'success',
    results: merchants.length,
    data: { merchants }
  });
});

exports.getMerchant = catchAsync(async (req, res, next) => {
  const merchant = await Merchant.findById(req.params.id).populate('prices');
  
  if (!merchant) {
    return next(new AppError('Merchant not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { merchant }
  });
});

exports.createMerchant = catchAsync(async (req, res) => {
  const merchant = await Merchant.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { merchant }
  });
});

exports.updateMerchant = catchAsync(async (req, res, next) => {
  const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!merchant) {
    return next(new AppError('Merchant not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { merchant }
  });
});

exports.deleteMerchant = catchAsync(async (req, res, next) => {
  const merchant = await Merchant.findByIdAndUpdate(req.params.id, { active: false });
  
  if (!merchant) {
    return next(new AppError('Merchant not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});