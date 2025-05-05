const Product = require('../models/product.model');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all products
 * @route GET /api/v1/products
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  // Execute query with features
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/**
 * Get product by ID
 * @route GET /api/v1/products/:id
 */
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Create new product
 * @route POST /api/v1/products
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  // Add current user to req.body
  req.body.createdBy = req.user.id;

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

/**
 * Update product
 * @route PATCH /api/v1/products/:id
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  // Find product by ID
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if user is product owner or admin
  if (product.createdBy.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to update this product', 403));
  }

  // Update product
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Delete product
 * @route DELETE /api/v1/products/:id
 */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  // Find product by ID
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Check if user is product owner or admin
  if (product.createdBy.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to delete this product', 403));
  }

  // Delete product
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Search products
 * @route GET /api/v1/products/search
 */
exports.searchProducts = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Please provide a search query', 400));
  }

  const products = await Product.find({
    $text: { $search: query }
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/**
 * Get featured products
 * @route GET /api/v1/products/featured
 */
exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 5;
  
  const products = await Product.find({ featured: true })
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/**
 * Get products stats
 * @route GET /api/v1/products/stats
 */
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { price: { $gte: 0 } }
    },
    {
      $group: {
        _id: '$category',
        numProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalStock: { $sum: '$stock' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});