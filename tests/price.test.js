const request = require('supertest');
const app = require('../src/app');
const { setupAdminUser } = require('./setup');
const Price = require('../src/models/price.model');
const Component = require('../src/models/component.model');
const Merchant = require('../src/models/merchant.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('Price API', () => {
  let token;
  let component;
  let merchant;
  let price;

  beforeEach(async () => {
    // Login as admin and get token
    token = await setupAdminUser();

    // Create test data
    component = await Component.create({
      category: '5f7d7e1c8f3d4e2b1c9a7d5e',
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

    merchant = await Merchant.create({
      name: 'Test Store',
      url: 'https://teststore.com',
      apiKey: 'test-api-key',
      commissionRate: 5,
      syncFrequency: 'daily'
    });

    price = await Price.create({
      component: component._id,
      merchant: merchant._id,
      price: 599.99,
      url: 'https://teststore.com/i9-12900k',
      inStock: true
    });
  });

  describe('GET /api/v1/prices', () => {
    test('should return all prices', async () => {
      const res = await request(app)
        .get('/api/v1/prices')
        .expect(200);

      expect(res.body.data.prices).toHaveLength(1);
      expect(res.body.data.prices[0].price).toBe(599.99);
    });
  });

  describe('POST /api/v1/prices', () => {
    test('should create a new price when admin', async () => {
      const newPrice = {
        component: "6818af05dc76d006e6142ba3",
        merchant: "6818aee0dc76d006e6142b9e",
        price: 699.99,
        url: 'https://teststore.com/i9-12900k-new',
        inStock: true
      };

      const res = await request(app)
        .post('/api/v1/prices')
        .set('Authorization', `Bearer ${token}`)
        .send(newPrice)
        .expect(201);

      expect(res.body.data.price.price).toBe(newPrice.price);
    });
  });
});