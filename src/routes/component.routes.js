const express = require('express');
const router = express.Router();
const componentController = require('../controllers/component.controller');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /components:
 *   get:
 *     summary: Retrieve a list of all components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: A list of components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109cb
 *                   name:
 *                     type: string
 *                     example: Resistor
 *                   categoryId:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *                   description:
 *                     type: string
 *                     example: A passive electrical component
 */

/**
 * @swagger
 * /components/category/{categoryId}:
 *   get:
 *     summary: Retrieve components by category ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: The category ID to filter components by
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: List of components in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109cb
 *                   name:
 *                     type: string
 *                     example: Resistor
 *                   description:
 *                     type: string
 *                     example: A passive electrical component
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /components/{id}:
 *   get:
 *     summary: Get a component by its ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The component ID
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     responses:
 *       200:
 *         description: Component found and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d0fe4f5311236168a109cb
 *                 name:
 *                   type: string
 *                   example: Resistor
 *                 categoryId:
 *                   type: string
 *                   example: 60d0fe4f5311236168a109ca
 *                 description:
 *                   type: string
 *                   example: A passive electrical component
 *       404:
 *         description: Component not found
 */

router.get('/', componentController.getAllComponents);
router.get('/category/:categoryId', componentController.getComponentsByCategory);
router.get('/:id', componentController.getComponent);

router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /components:
 *   post:
 *     summary: Create a new component (admin only)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Resistor
 *               categoryId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               description:
 *                 type: string
 *                 example: A passive electrical component
 *     responses:
 *       201:
 *         description: Component created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', componentController.createComponent);

/**
 * @swagger
 * /components/{id}:
 *   patch:
 *     summary: Update a component by ID (admin only)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the component to update
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Component Name
 *               categoryId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Component updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Component not found
 */
router.patch('/:id', componentController.updateComponent);

/**
 * @swagger
 * /components/{id}:
 *   delete:
 *     summary: Delete a component by ID (admin only)
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the component to delete
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     responses:
 *       204:
 *         description: Component deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Component not found
 */
router.delete('/:id', componentController.deleteComponent);

module.exports = router;