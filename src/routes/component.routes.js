const express = require('express');
const router = express.Router();
const componentController = require('../controllers/component.controller');
const { protect, restrictTo } = require('../middleware/auth');

router
  .route('/')
  .get(componentController.getAllComponents)
  .post(protect, restrictTo('admin'), componentController.createComponent);

router
  .route('/category/:categoryId')
  .get(componentController.getComponentsByCategory);

router
  .route('/:id')
  .get(componentController.getComponent)
  .patch(protect, restrictTo('admin'), componentController.updateComponent)
  .delete(protect, restrictTo('admin'), componentController.deleteComponent);

module.exports = router;