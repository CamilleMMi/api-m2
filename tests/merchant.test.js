const request = require('supertest');
const app = require('../src/app');
const { setupAdminUser } = require('./setup');
const Merchant = require('../src/models/merchant.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('Merchant API', () => {
  let token;
  let merchant;

  beforeEach(async () => {
    // Login as admin and get token
    token = await setupAdminUser();

    // Create test merchant
    merchant = await Merchant.create({
      name: 'Test Store',
      url: 'https://teststore.com',
      apiKey: 'test-api-key',
      commissionRate: 5,
      syncFrequency: 'daily'
    });
  });

  describe('GET /api/v1/merchants', () => {
    test('should return all active merchants', async () => {
      const res = await request(app)
        .get('/api/v1/merchants')
        .expect(200);

      expect(res.body.data.merchants).toHaveLength(1);
      expect(res.body.data.merchants[0].name).toBe('Test Store');
    });
  });

  describe('POST /api/v1/merchants', () => {
    test('should create a new merchant when admin', async () => {
      const newMerchant = {
        name: 'New Store',
        url: 'https://newstore.com',
        apiKey: 'new-api-key',
        commissionRate: 7,
        syncFrequency: 'daily'
      };

      const res = await request(app)
        .post('/api/v1/merchants')
        .set('Authorization', `Bearer ${token}`)
        .send(newMerchant)
        .expect(201);

      expect(res.body.data.merchant.name).toBe(newMerchant.name);
    });
  });
});