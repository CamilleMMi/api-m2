const express = require('express'); 
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API pour gérer les catégories de composants
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories retournée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la catégorie à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/:id', categoryController.getCategory);

router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Données de la nouvelle catégorie
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 */
router.post('/', categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Mettre à jour une catégorie existante
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la catégorie à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Données à modifier
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catégorie non trouvée
 */
router.patch('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la catégorie à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;