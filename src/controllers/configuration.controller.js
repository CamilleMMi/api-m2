const Configuration = require('../models/configuration.model');
const Component = require('../models/component.model');
const Price = require('../models/price.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const PDFDocument = require('pdfkit');

/**
 * Get all configurations for current user
 * @route GET /api/v1/configurations
 */
exports.getAllConfigurations = catchAsync(async (req, res, next) => {
  const configurations = await Configuration.find({ user: req.user.id });
  
  res.status(200).json({
    status: 'success',
    results: configurations.length,
    data: { configurations }
  });
});

/**
 * Get all configurations (admin only)
 * @route GET /api/v1/configurations/admin
 */
exports.getAllConfigurationsAdmin = catchAsync(async (req, res, next) => {
  const configurations = await Configuration.find();
  
  res.status(200).json({
    status: 'success',
    results: configurations.length,
    data: { configurations }
  });
});

/**
 * Get configuration by ID
 * @route GET /api/v1/configurations/:id
 */
exports.getConfiguration = catchAsync(async (req, res, next) => {
  const configuration = await Configuration.findById(req.params.id);
  
  if (!configuration) {
    return next(new AppError('Configuration not found', 404));
  }
  
  // Check if user owns the configuration or is admin
  if (configuration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this configuration', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: { configuration }
  });
});

/**
 * Create new configuration
 * @route POST /api/v1/configurations
 */
exports.createConfiguration = catchAsync(async (req, res, next) => {
  // Calculate total price
  let totalPrice = 0;
  const componentsWithPrices = [];
  
  for (const item of req.body.components) {
    const component = await Component.findById(item.component);
    if (!component) {
      return next(new AppError(`Component with ID ${item.component} not found`, 404));
    }
    
    let price = item.price;
    if (item.selectedMerchant) {
      const priceData = await Price.findOne({
        component: item.component,
        merchant: item.selectedMerchant
      });
      if (priceData) {
        price = priceData.price;
      }
    }
    
    componentsWithPrices.push({
      component: item.component,
      selectedMerchant: item.selectedMerchant,
      price: price
    });
    
    totalPrice += price;
  }
  
  const configuration = await Configuration.create({
    user: req.user.id,
    name: req.body.name,
    components: componentsWithPrices,
    totalPrice: totalPrice,
    public: req.body.public || false,
    notes: req.body.notes
  });
  
  res.status(201).json({
    status: 'success',
    data: { configuration }
  });
});

/**
 * Update configuration
 * @route PATCH /api/v1/configurations/:id
 */
exports.updateConfiguration = catchAsync(async (req, res, next) => {
  let configuration = await Configuration.findById(req.params.id);
  
  if (!configuration) {
    return next(new AppError('Configuration not found', 404));
  }
  
  // Check if user owns the configuration or is admin
  if (configuration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this configuration', 403));
  }
  
  // Recalculate total price if components are updated
  if (req.body.components) {
    let totalPrice = 0;
    const componentsWithPrices = [];
    
    for (const item of req.body.components) {
      const component = await Component.findById(item.component);
      if (!component) {
        return next(new AppError(`Component with ID ${item.component} not found`, 404));
      }
      
      let price = item.price;
      if (item.selectedMerchant) {
        const priceData = await Price.findOne({
          component: item.component,
          merchant: item.selectedMerchant
        });
        if (priceData) {
          price = priceData.price;
        }
      }
      
      componentsWithPrices.push({
        component: item.component,
        selectedMerchant: item.selectedMerchant,
        price: price
      });
      
      totalPrice += price;
    }
    
    req.body.components = componentsWithPrices;
    req.body.totalPrice = totalPrice;
  }
  
  configuration = await Configuration.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    status: 'success',
    data: { configuration }
  });
});

/**
 * Delete configuration
 * @route DELETE /api/v1/configurations/:id
 */
exports.deleteConfiguration = catchAsync(async (req, res, next) => {
  const configuration = await Configuration.findById(req.params.id);
  
  if (!configuration) {
    return next(new AppError('Configuration not found', 404));
  }
  
  // Check if user owns the configuration or is admin
  if (configuration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this configuration', 403));
  }
  
  await Configuration.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Calculate total price for a configuration
 * @route POST /api/v1/configurations/calculate-price
 */
exports.calculatePrice = catchAsync(async (req, res, next) => {
  let totalPrice = 0;
  const componentDetails = [];
  
  for (const item of req.body.components) {
    const component = await Component.findById(item.component).populate('category');
    if (!component) {
      return next(new AppError(`Component with ID ${item.component} not found`, 404));
    }
    
    let price = item.price;
    let merchant = null;
    
    if (item.selectedMerchant) {
      const priceData = await Price.findOne({
        component: item.component,
        merchant: item.selectedMerchant
      }).populate('merchant');
      
      if (priceData) {
        price = priceData.price;
        merchant = priceData.merchant;
      }
    }
    
    componentDetails.push({
      component: component,
      merchant: merchant,
      price: price
    });
    
    totalPrice += price;
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      components: componentDetails,
      totalPrice: totalPrice
    }
  });
});

/**
 * Export configuration to PDF
 * @route GET /api/v1/configurations/:id/export-pdf
 */
exports.exportToPDF = catchAsync(async (req, res, next) => {
  const configuration = await Configuration.findById(req.params.id);
  
  if (!configuration) {
    return next(new AppError('Configuration not found', 404));
  }
  
  // Check if user owns the configuration or is admin
  if (configuration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this configuration', 403));
  }
  
  // Create PDF document
  const doc = new PDFDocument();
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="configuration-${configuration.name}.pdf"`);
  
  // Pipe PDF to response
  doc.pipe(res);
  
  // Add content to PDF
  doc.fontSize(20).text('Configuration PC', 50, 50);
  doc.fontSize(16).text(`Nom: ${configuration.name}`, 50, 100);
  doc.fontSize(12).text(`Date de création: ${configuration.createdAt.toLocaleDateString()}`, 50, 130);
  doc.text(`Prix total: ${configuration.totalPrice}€`, 50, 150);
  
  if (configuration.notes) {
    doc.text(`Notes: ${configuration.notes}`, 50, 170);
  }
  
  doc.text('Composants:', 50, 200);
  
  let yPosition = 230;
  configuration.components.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.component.title}`, 70, yPosition);
    doc.text(`   Catégorie: ${item.component.category.name}`, 70, yPosition + 15);
    doc.text(`   Prix: ${item.price}€`, 70, yPosition + 30);
    if (item.selectedMerchant) {
      doc.text(`   Marchand: ${item.selectedMerchant.name}`, 70, yPosition + 45);
      yPosition += 75;
    } else {
      yPosition += 60;
    }
  });
  
  // Finalize PDF
  doc.end();
});

/**
 * Get public configurations
 * @route GET /api/v1/configurations/public
 */
exports.getPublicConfigurations = catchAsync(async (req, res, next) => {
  const configurations = await Configuration.find({ public: true });
  
  res.status(200).json({
    status: 'success',
    results: configurations.length,
    data: { configurations }
  });
});