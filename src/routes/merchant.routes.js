const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant.controller');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: Get all merchants (public)
 *     tags: [Merchants]
 *     responses:
 *       200:
 *         description: List of merchants
 */
router.get('/', merchantController.getAllMerchants);

/**
 * @swagger
 * /merchants/{id}:
 *   get:
 *     summary: Get a merchant by ID (public)
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Merchant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchant details
 *       404:
 *         description: Merchant not found
 */
router.get('/:id', merchantController.getMerchant);

router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /merchants:
 *   post:
 *     summary: Create a new merchant (admin only)
 *     tags: [Merchants]
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
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', merchantController.createMerchant);

/**
 * @swagger
 * /merchants/{id}:
 *   patch:
 *     summary: Update a merchant by ID (admin only)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Merchant ID
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
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Merchant updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Merchant not found
 */
router.patch('/:id', merchantController.updateMerchant);

/**
 * @swagger
 * /merchants/{id}:
 *   delete:
 *     summary: Delete a merchant by ID (admin only)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Merchant ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Merchant deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Merchant not found
 */
router.delete('/:id', merchantController.deleteMerchant);

module.exports = router;