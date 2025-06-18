const User = require('../models/user.model');
const Configuration = require('../models/configuration.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Get all users (admin only)
 * @route GET /api/v1/users
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

/**
 * Get user by ID (admin only)
 * @route GET /api/v1/users/:id
 */
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Get user's configurations
  const configurations = await Configuration.find({ user: req.params.id });
  
  res.status(200).json({
    status: 'success',
    data: { 
      user,
      configurations
    }
  });
});

/**
 * Update user (admin only)
 * @route PATCH /api/v1/users/:id
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  // Don't allow password updates through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400));
  }
  
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * Delete user (admin only)
 * @route DELETE /api/v1/users/:id
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false });
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get user statistics (admin only)
 * @route GET /api/v1/users/stats
 */
exports.getUserStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $match: { active: { $ne: false } }
    },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalUsers = await User.countDocuments({ active: { $ne: false } });
  const totalConfigurations = await Configuration.countDocuments();
  
  res.status(200).json({
    status: 'success',
    data: {
      usersByRole: stats,
      totalUsers,
      totalConfigurations
    }
  });
});