const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect, restrictTo } = require('../middleware/auth');

router
  .route('/')
  .get(priceController.getAllPrices)
  .post(protect, restrictTo('admin'), priceController.createPrice);

router
  .route('/:id')
  .get(priceController.getPrice)
  .patch(protect, restrictTo('admin'), priceController.updatePrice)
  .delete(protect, restrictTo('admin'), priceController.deletePrice);

module.exports = router;