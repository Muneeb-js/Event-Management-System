import request from 'supertest';
import { app } from '../app.js';

describe('Healthcheck API Endpoint', () => {
  test('GET /api/v1/healthcheck should return 200 OK and success payload', async () => {
    const response = await request(app)
      .get('/api/v1/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Everything is working fine');
  });
});
