const request = require('supertest');
const app = require('../src/app');
const { setupAdminUser } = require('./setup');
const Configuration = require('../src/models/configuration.model');
const Component = require('../src/models/component.model');
const Category = require('../src/models/category.model');
const User = require('../src/models/user.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('Configuration API', () => {
  let token;
  let category;
  let component;
  let configuration;

beforeEach(async () => {
  token = await setupAdminUser();

  const adminUser = await User.findOne({ email: 'admin@test.com' });

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

  // Create test configuration
  configuration = await Configuration.create({
    user: adminUser._id,
    name: 'Gaming PC',
    components: [{
      component: component._id,
      price: 599.99
    }],
    totalPrice: 599.99,
    public: false
  });
});

  describe('GET /api/v1/configurations', () => {
    test('should return user configurations', async () => {
      const res = await request(app)
        .get('/api/v1/configurations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data.configurations).toHaveLength(1);
      expect(res.body.data.configurations[0].name).toBe('Gaming PC');
    });
  });

  describe('POST /api/v1/configurations', () => {
    test('should create a new configuration', async () => {
      const newConfiguration = {
        name: 'Office PC',
        components: [{
          component: component._id,
          price: 299.99
        }],
        public: false
      };

      const res = await request(app)
        .post('/api/v1/configurations')
        .set('Authorization', `Bearer ${token}`)
        .send(newConfiguration)
        .expect(201);

      expect(res.body.data.configuration.name).toBe(newConfiguration.name);
      expect(res.body.data.configuration.totalPrice).toBe(299.99);
    });
  });

  describe('POST /api/v1/configurations/calculate-price', () => {
    test('should calculate total price for components', async () => {
      const components = [{
        component: component._id,
        price: 599.99
      }];

      const res = await request(app)
        .post('/api/v1/configurations/calculate-price')
        .set('Authorization', `Bearer ${token}`)
        .send({ components })
        .expect(200);

      expect(res.body.data.totalPrice).toBe(599.99);
      expect(res.body.data.components).toHaveLength(1);
    });
  });

  describe('GET /api/v1/configurations/:id/export-pdf', () => {
    test('should export configuration to PDF', async () => {
      const res = await request(app)
        .get(`/api/v1/configurations/${configuration._id}/export-pdf`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.headers['content-type']).toBe('application/pdf');
    });
  });
});