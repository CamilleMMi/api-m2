const Component = require('../models/component.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllComponents = catchAsync(async (req, res) => {
  const components = await Component.find({ active: true })
    .populate('category')
    .populate('prices');
  
  res.status(200).json({
    status: 'success',
    results: components.length,
    data: { components }
  });
});

exports.getComponentsByCategory = catchAsync(async (req, res) => {
  const components = await Component.find({
    category: req.params.categoryId,
    active: true
  }).populate('prices');
  
  res.status(200).json({
    status: 'success',
    results: components.length,
    data: { components }
  });
});

exports.getComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findById(req.params.id)
    .populate('category')
    .populate({
      path: 'prices',
      populate: { path: 'merchant' }
    });
  
  if (!component) {
    return next(new AppError('Component not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { component }
  });
});

exports.createComponent = catchAsync(async (req, res) => {
  const component = await Component.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { component }
  });
});

exports.updateComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!component) {
    return next(new AppError('Component not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { component }
  });
});

exports.deleteComponent = catchAsync(async (req, res, next) => {
  const component = await Component.findByIdAndUpdate(req.params.id, { active: false });
  
  if (!component) {
    return next(new AppError('Component not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});