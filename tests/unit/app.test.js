const request = require('supertest');

const app = require('../../src/app');

describe('/', () => {
  test('Resources that cant be found redirected here', async () => {
    const res = await request(app).get('/er');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
  });
});
