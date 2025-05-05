const request = require('supertest');
const app = require('../src/app');
const { setupAdminUser } = require('./setup');
const Component = require('../src/models/component.model');
const Category = require('../src/models/category.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('Component API', () => {
  let token;
  let category;
  let component;

  beforeEach(async () => {
    // Login as admin and get token
    token = await setupAdminUser();

    // Create test category
    category = await Category.create({
      name: 'CPU',
      description: 'Central Processing Unit'
    });

    // Create test component
    component = await Component.create({
      category: category._id,
      brand: 'Intel',
      model: 'i9-12900K',
      title: 'Intel Core i9-12900K',
      description: 'High-end desktop processor',
      specifications: {
        cores: '16',
        threads: '24',
        baseFrequency: '3.2 GHz'
      },
      imageUrl: 'https://example.com/i9-12900k.jpg'
    });
  });

  describe('GET /api/v1/components', () => {
    test('should return all active components', async () => {
      const res = await request(app)
        .get('/api/v1/components')
        .expect(200);

      expect(res.body.data.components).toHaveLength(1);
      expect(res.body.data.components[0].model).toBe('i9-12900K');
    });
  });

  describe('GET /api/v1/components/category/:categoryId', () => {
    test('should return components by category', async () => {
      const res = await request(app)
        .get(`/api/v1/components/category/${category._id}`)
        .expect(200);

      expect(res.body.data.components).toHaveLength(1);
      expect(res.body.data.components[0].brand).toBe('Intel');
    });
  });

  describe('POST /api/v1/components', () => {
    test('should create a new component when admin', async () => {
      const newComponent = {
        category: category._id,
        brand: 'AMD',
        model: 'Ryzen 9 5950X',
        title: 'AMD Ryzen 9 5950X',
        description: 'High-end desktop processor',
        specifications: {
          cores: '16',
          threads: '32',
          baseFrequency: '3.4 GHz'
        },
        imageUrl: 'https://example.com/5950x.jpg'
      };

      const res = await request(app)
        .post('/api/v1/components')
        .set('Authorization', `Bearer ${token}`)
        .send(newComponent)
        .expect(201);

      expect(res.body.data.component.model).toBe(newComponent.model);
    });
  });
});