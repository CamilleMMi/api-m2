const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { setupTestDB } = require('./testUtils');

setupTestDB();

describe('User API', () => {
  let adminToken;
  let user;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
      role: 'admin'
    });

    // Login as admin and get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    adminToken = loginResponse.body.token;

    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });
  });

  describe('GET /api/v1/users', () => {
    test('should return all users when admin', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.users).toHaveLength(2);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    test('should return user by id when admin', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.user.name).toBe('Test User');
    });
  });

  describe('GET /api/v1/users/stats', () => {
    test('should return user statistics when admin', async () => {
      const res = await request(app)
        .get('/api/v1/users/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.totalUsers).toBe(2);
      expect(res.body.data.usersByRole).toHaveLength(2);
    });
  });
});