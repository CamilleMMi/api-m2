const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configuration.controller');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /configurations/public:
 *   get:
 *     summary: Retrieve all public configurations
 *     tags: [Configurations]
 *     responses:
 *       200:
 *         description: List of public configurations
 */
router.get('/public', configurationController.getPublicConfigurations);

/**
 * @swagger
 * /configurations:
 *   get:
 *     summary: Retrieve all configurations (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all configurations
 */
router.use(protect);
router.get('/', configurationController.getAllConfigurations);

/**
 * @swagger
 * /configurations:
 *   post:
 *     summary: Create a new configuration (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: Configuration created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', configurationController.createConfiguration);

/**
 * @swagger
 * /configurations/calculate-price:
 *   post:
 *     summary: Calculate price based on configuration input (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: object
 *     responses:
 *       200:
 *         description: Price calculated successfully
 */
router.post('/calculate-price', configurationController.calculatePrice);

/**
 * @swagger
 * /configurations/{id}:
 *   get:
 *     summary: Get configuration by ID (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration details
 *       404:
 *         description: Configuration not found
 */
router.get('/:id', configurationController.getConfiguration);

/**
 * @swagger
 * /configurations/{id}:
 *   patch:
 *     summary: Update configuration by ID (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       404:
 *         description: Configuration not found
 */
router.patch('/:id', configurationController.updateConfiguration);

/**
 * @swagger
 * /configurations/{id}:
 *   delete:
 *     summary: Delete configuration by ID (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Configuration deleted successfully
 *       404:
 *         description: Configuration not found
 */
router.delete('/:id', configurationController.deleteConfiguration);

/**
 * @swagger
 * /configurations/{id}/export-pdf:
 *   get:
 *     summary: Export configuration as PDF (authenticated users)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF exported successfully
 */
router.get('/:id/export-pdf', configurationController.exportToPDF);

/**
 * @swagger
 * /configurations/admin/all:
 *   get:
 *     summary: Get all configurations (admin only)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all configurations (admin view)
 *       403:
 *         description: Forbidden - admin only
 */
router.get('/admin/all', restrictTo('admin'), configurationController.getAllConfigurationsAdmin);

module.exports = router;