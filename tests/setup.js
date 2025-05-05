const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');

async function setupAdminUser() {
  let admin = await User.findOne({ email: 'admin@test.com' });

  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      passwordConfirm: 'password123',
      role: 'admin'
    });
  }

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'password123'
    });

  return loginResponse.body.token;
}

module.exports = {
  setupAdminUser,
};