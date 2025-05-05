const request = require('supertest');
const { setupAdminUser } = require('./setup');
const app = require('../src/app');
const Category = require('../src/models/category.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('Category API', () => {
  let token;
  let category;

  beforeEach(async () => {
    // Login as admin and get token
    token = await setupAdminUser();

    // Create test category
    category = await Category.create({
      name: 'CPU',
      description: 'Central Processing Unit'
    });
  });

  describe('GET /api/v1/categories', () => {
    test('should return all active categories', async () => {
      const res = await request(app)
        .get('/api/v1/categories')
        .expect(200);

      expect(res.body.data.categories).toHaveLength(1);
      expect(res.body.data.categories[0].name).toBe('CPU');
    });
  });

  describe('POST /api/v1/categories', () => {
    test('should create a new category when admin', async () => {
      const newCategory = {
        name: 'GPU',
        description: 'Graphics Processing Unit'
      };

      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      expect(res.body.data.category.name).toBe(newCategory.name);
    });

    test('should not create category without auth', async () => {
      const newCategory = {
        name: 'GPU',
        description: 'Graphics Processing Unit'
      };

      await request(app)
        .post('/api/v1/categories')
        .send(newCategory)
        .expect(401);
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    test('should return category by id', async () => {
      const res = await request(app)
        .get(`/api/v1/categories/${category._id}`)
        .expect(200);

      expect(res.body.data.category.name).toBe('CPU');
    });

    test('should return 404 if category not found', async () => {
      await request(app)
        .get('/api/v1/categories/5f7d7e1c8f3d4e2b1c9a7d5e')
        .expect(404);
    });
  });
});