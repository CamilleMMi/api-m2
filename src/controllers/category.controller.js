const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ active: true });
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories }
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('components');
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { category }
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { active: false });
  
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});