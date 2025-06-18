const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /prices:
 *   get:
 *     summary: Get all prices (public)
 *     tags: [Prices]
 *     responses:
 *       200:
 *         description: List of prices
 */
router.get('/', priceController.getAllPrices);

/**
 * @swagger
 * /prices/{id}:
 *   get:
 *     summary: Get a price by ID (public)
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price details
 *       404:
 *         description: Price not found
 */
router.get('/:id', priceController.getPrice);

router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /prices:
 *   post:
 *     summary: Create a new price (admin only)
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Price created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', priceController.createPrice);

/**
 * @swagger
 * /prices/{id}:
 *   patch:
 *     summary: Update a price by ID (admin only)
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Price updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Price not found
 */
router.patch('/:id', priceController.updatePrice);

/**
 * @swagger
 * /prices/{id}:
 *   delete:
 *     summary: Delete a price by ID (admin only)
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Price ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Price deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Price not found
 */
router.delete('/:id', priceController.deletePrice);

module.exports = router;
