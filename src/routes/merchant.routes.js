const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant.controller');
const { protect, restrictTo } = require('../middleware/auth');

router
  .route('/')
  .get(merchantController.getAllMerchants)
  .post(protect, restrictTo('admin'), merchantController.createMerchant);

router
  .route('/:id')
  .get(merchantController.getMerchant)
  .patch(protect, restrictTo('admin'), merchantController.updateMerchant)
  .delete(protect, restrictTo('admin'), merchantController.deleteMerchant);

module.exports = router;