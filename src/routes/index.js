const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const componentRoutes = require('./component.routes');
const merchantRoutes = require('./merchant.routes');
const priceRoutes = require('./price.routes');
const configurationRoutes = require('./configuration.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/components', componentRoutes);
router.use('/merchants', merchantRoutes);
router.use('/prices', priceRoutes);
router.use('/configurations', configurationRoutes);
router.use('/users', userRoutes);

module.exports = router;